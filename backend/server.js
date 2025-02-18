require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database");
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Set in .env file
      pass: process.env.EMAIL_PASS, // Set in .env file
    },
  });
  
  // Store OTPs temporarily
  const otpStore = {};
  
  // Generate OTP
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
  
  // Route to send OTP
  app.post("/send-otp", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
  
    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes
  
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: "Failed to send OTP" });
      res.json({ message: "OTP sent successfully" });
    });
  });
  
// Route to verify OTP and register user
app.post("/register", async (req, res) => {
    const {username, email, password, otp } = req.body;
    if (!username || !email || !password || !otp) return res.status(400).json({ error: "All fields are required" });
  
    // Check OTP validity
    const storedOtp = otpStore[email];
    if (!storedOtp || storedOtp.otp !== parseInt(otp) || storedOtp.expires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
  
    delete otpStore[email]; // Remove OTP after successful validation
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert user into database
    db.query("INSERT INTO users (username, email, password) VALUES (?, ?,?)", [username, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
  
      // Generate token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ message: "User registered successfully", token });
    });
  });
  

// **User Login**
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ message: "Invalid credentials" });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    });
});

// **Protected Route (Example)**
app.get("/profile", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        res.json({ message: "Welcome to your profile", user: decoded });
    });
});

// Get all questions
app.get("/api/questions", (req, res) => {
  const sql = "SELECT * FROM questions";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching questions:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!results.length) {
      return res.status(404).json({ message: "No questions found" });
    }

    // ✅ Filter out empty or NULL options
    const formattedResults = results.map((q) => {
      const options = [q.option1, q.option2, q.option3, q.option4].filter(opt => opt); // Remove empty values
      return {
        id: q.id,
        question: q.question,
        options,
        correctIndex: q.correctIndex < options.length ? q.correctIndex : 0, // Ensure valid index
      };
    });

    res.json(formattedResults);
  });
});

// Post a new question
app.post("/api/questions", (req, res) => {
  const { question, options, correctIndex } = req.body;

  if (!question || !Array.isArray(options) || options.length < 2 || options.length > 4) {
    return res.status(400).json({ error: "Provide a question with 2 to 4 options" });
  }

  if (correctIndex < 0 || correctIndex >= options.length) {
    return res.status(400).json({ error: "correctIndex out of range" });
  }

  // Assign options to database columns
  const [option1, option2, option3 = null, option4 = null] = options;

  const sql = `INSERT INTO questions (question, option1, option2, option3, option4, correctIndex) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [question, option1, option2, option3, option4, correctIndex];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error inserting question:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ id: result.insertId, question, options, correctIndex });
  });
});



// Update a question
app.put("/api/questions/:id", (req, res) => {
  const { id } = req.params;
  const { question, options, correctIndex } = req.body;

  if (!question || options.length !== 4 || correctIndex === undefined) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const sql = `UPDATE questions SET question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, correctIndex = ? WHERE id = ?`;
  const values = [question, ...options, correctIndex, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating question:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Question updated successfully" });
  });
});

// Delete a question
app.delete("/api/questions/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM questions WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting question:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Question deleted successfully" });
  });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
