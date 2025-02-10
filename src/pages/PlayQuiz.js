import { useState, useEffect } from "react";

function PlayQuiz() {
  const questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [answered, setAnswered] = useState(false); // ✅ Track if user has answered

  useEffect(() => {
    console.log("Score Updated:", score);
  }, [score]);

  useEffect(() => {
    if (showResult) {
      setFinalScore(score);
    }
  }, [showResult]);

  const handleOptionClick = (index) => {
    if (!answered) {
      setSelectedAnswer(index);
      setAnswered(true);

      if (questions[currentIndex]?.correctIndex === index) {
        setScore((prevScore) => prevScore + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult && finalScore !== null) {
    return (
      <div className="result-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center" }}>
        <h2>🎉 Quiz Completed!</h2>
        <p>Your Score: <strong>{finalScore} / {questions.length}</strong></p>
        <button className="btn restart-btn" onClick={() => window.location.reload()}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-box">
        <h3 className="question-count">Question {currentIndex + 1} of {questions.length}</h3>
        <h2>{questions[currentIndex]?.question}</h2>

        <div className="options-container">
          {questions[currentIndex]?.options.map((option, i) => (
            <button
              key={i}
              className={`option-btn 
                ${answered && i === questions[currentIndex]?.correctIndex ? "correct" : ""}
                ${answered && selectedAnswer === i && i !== questions[currentIndex]?.correctIndex ? "wrong" : ""}
              `}
              onClick={() => handleOptionClick(i)}
              disabled={answered} // ✅ Disable after selection
            >
              {option}
            </button>
          ))}
        </div>

        <button className="btn next-btn" onClick={handleNext} disabled={!answered}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PlayQuiz;
