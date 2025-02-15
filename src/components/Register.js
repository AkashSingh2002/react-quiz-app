import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "", otp: "" });
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Send OTP
    const sendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/send-otp", { email: formData.email });
            alert("OTP sent to your email!");
            setOtpSent(true);
        } catch (err) {
            console.error("Error sending OTP:", err);
        }
    };

    // Register User with OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending data:", formData); // ✅ Log request data
        try {
            const response = await axios.post("/register", formData);
            console.log("Response:", response.data);
            alert("Registered Successfully!");
            navigate("/login");
        } catch (err) {
            console.error("Registration Error:", err.response?.data || err);
            alert("Registration failed: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div className="form-container flex flex-col items-center">
            <h2>Register</h2>
            <form onSubmit={otpSent ? handleSubmit : sendOtp} className="flex flex-col">
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                {!otpSent ? (
                    <button type="submit">Send OTP</button>
                ) : (
                    <>
                        <input type="text" name="otp" placeholder="Enter OTP" onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                        <button type="submit">Register</button>
                    </>
                )}
            </form>
        </div>
    );
}

export default Register;
