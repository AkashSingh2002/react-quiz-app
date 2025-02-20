import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import "./playquiz.css";

function PlayQuiz() {
  const { updateQuizStats } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

  const handleOptionClick = (index) => {
    if (!answered) {
      setSelectedAnswer(index);
      setAnswered(true);

      if (questions[currentIndex]?.correctIndex === index) {
        setScore(prevScore => prevScore + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
      updateQuizStats(questions.length, score); // Send data to AuthContext
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswered(false);
  };

  if (showResult) {
    return (
      <div className="result-container">
        <p className="result-score">Your Score: {score} / {questions.length}</p>
        <button className="restart-btn" onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h3>Question {currentIndex + 1} of {questions.length}</h3>
      <h2>{questions[currentIndex]?.question}</h2>

      <div className="options-container">
        {questions[currentIndex]?.options.map((option, i) => {
          let buttonClass = "option";
          if (answered) {
            if (i === questions[currentIndex]?.correctIndex) {
              buttonClass = "correct";
            } else if (i === selectedAnswer) {
              buttonClass = "wrong";
            }
          } else if (selectedAnswer === i) {
            buttonClass = "selected";
          }

          return (
            <button
              key={i}
              onClick={() => handleOptionClick(i)}
              disabled={answered}
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      <button className="next-btn" onClick={handleNext} disabled={!answered}>Next</button>
    </div>
  );
}

export default PlayQuiz;
