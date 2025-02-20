import React from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
    const { user, activityHistory } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            {/* Dashboard Header */}
            {/* <h1 className="dashboard-title">User Dashboard</h1> */}

            {user ? (
                <div className="dashboard-content">
                    {/* User Info Section */}
                    <div className="user-info">
                        <h2 style={{color: "white"}}>Welcome, {user.username}!</h2>
                        <p className="last-login">
                            Last Login: {activityHistory.length > 0 
                                ? new Date(activityHistory[activityHistory.length - 1].date).toLocaleString() 
                                : "No previous login data"}
                        </p>
                    </div>

                    {/* Quiz History Section */}
                    <div className="dashboard-section">
                        <h2 style={{color: "white"}}>Quiz History</h2>

                        {activityHistory.length > 0 ? (
                            <table className="quiz-table">
                                <thead>
                                    <tr>
                                        <th>Quiz</th>
                                        <th>Played On</th>
                                        <th>Questions Attempted</th>
                                        <th>Score</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityHistory
                                        .slice()
                                        .reverse()
                                        .map((quiz, index) => (
                                            <tr key={index}>
                                                <td>Quiz {activityHistory.length - index}</td>
                                                <td>{new Date(quiz.date).toLocaleString()}</td>
                                                <td>{quiz.questionsAttempted}</td>
                                                <td>{quiz.score}</td>
                                                <td>
                                                    <button 
                                                        className="view-detail-btn" 
                                                        onClick={() => navigate(`/quiz-detail/${activityHistory.length - 1 - index}`)}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-activity">No quiz history available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-red-400">Please log in to view the dashboard.</p>
            )}
        </div>
    );
};

export default Dashboard;
