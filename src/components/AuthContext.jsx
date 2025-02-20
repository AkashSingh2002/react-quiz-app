import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [activityHistory, setActivityHistory] = useState([]);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem("user");
            const storedHistory = localStorage.getItem("activityHistory");

            if (token && storedUser) {
                setIsLoggedIn(true);
                setUser(JSON.parse(storedUser));
                setActivityHistory(storedHistory ? JSON.parse(storedHistory) : []);
            }
        } catch (error) {
            console.error("Error loading auth data from localStorage:", error);
            localStorage.clear(); // Clear invalid data to prevent further errors
        }
    }, []);

    const login = (token, userData) => {
        try {
            const storedHistory = localStorage.getItem("activityHistory");
            const existingHistory = storedHistory ? JSON.parse(storedHistory) : [];

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("activityHistory", JSON.stringify(existingHistory));

            setIsLoggedIn(true);
            setUser(userData);
            setActivityHistory(existingHistory);
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const updateQuizStats = (questions, score) => {
        try {
            const newQuizAttempt = {
                date: new Date().toISOString(),
                questionsAttempted: questions,
                score: score,
            };

            const updatedHistory = [...activityHistory, newQuizAttempt];

            localStorage.setItem("activityHistory", JSON.stringify(updatedHistory));
            setActivityHistory(updatedHistory);
        } catch (error) {
            console.error("Error updating quiz stats:", error);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setIsLoggedIn(false);
            setUser(null);
            setActivityHistory([]);  // Keep history in localStorage
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, activityHistory, login, logout, updateQuizStats }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
