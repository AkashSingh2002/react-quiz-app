import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./login.css";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(""); // Handle error messages
    const navigate = useNavigate();
    const { login } = useAuth(); // Get login function from context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error on new attempt
    
        try {
            const res = await axios.post("/login", formData);
    
            if (res.data?.token && res.data?.user) {
                const { token, user } = res.data;
    
                // Store token and user details
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
    
                // Update auth state
                login(token, user);
    
                // Redirect to home
                navigate("/");
    
                console.log("Stored user:", JSON.parse(localStorage.getItem("user"))); // Debugging
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            // Handle various error cases
            if (err.response) {
                console.error("Server Error:", err.response.data);
                setError(err.response.data.message || "Invalid email or password");
            } else if (err.request) {
                console.error("Network Error:", err.request);
                setError("Network error. Please try again.");
            } else {
                console.error("Error:", err.message);
                setError("Something went wrong. Please try again.");
            }
        }
    };
    
    

    return (
        <div className="form-container flex flex-col items-center">
            <h2>Login</h2>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
