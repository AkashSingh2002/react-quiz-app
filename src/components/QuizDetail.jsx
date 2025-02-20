import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Chart from "chart.js/auto";
import "./quizDetail.css";

const QuizDetail = () => {
    const { activityHistory } = useAuth();
    const { id } = useParams();
    const quizIndex = parseInt(id);
    const quiz = activityHistory[quizIndex];

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (quiz && chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(chartRef.current, {
                type: "doughnut",
                data: {
                    labels: ["Score", "Remaining"],
                    datasets: [
                        {
                            data: [quiz.score, quiz.questionsAttempted - quiz.score],
                            backgroundColor: ["#4CAF50", "#ddd"],
                            hoverBackgroundColor: ["#45a049", "#ccc"],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }
    }, [quiz]);

    if (!quiz) return <p className="no-activity">Quiz not found.</p>;

    return (
        <div className="quiz-detail-container">
            <h1 className="quiz-title">Quiz Details</h1>

            <div className="quiz-card">
                <h2>Quiz Attempt {quizIndex + 1}</h2>
                <p><strong>Played On:</strong> {new Date(quiz.date).toLocaleString()}</p>
                <p><strong>Questions Attempted:</strong> {quiz.questionsAttempted}</p>
                <p><strong>Score:</strong> {quiz.score}</p>

                {/* Score Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar" style={{ width:  `${(quiz.score / quiz.questionsAttempted) * 100}%` }}></div>
                </div>
                <p className="score-label">{quiz.score}%</p>

                {/* Score Chart */}
                <div className="chart-container">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>

            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        </div>
    );
};

export default QuizDetail;
