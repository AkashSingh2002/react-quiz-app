import { useState } from "react";

function PlayQuiz() {
  const questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) return <div className="result-container">Quiz Completed!</div>;

  return (
    <div className="quiz-container">
      <h2>{questions[currentIndex]?.question}</h2>
      <div className="button-group">
        {questions[currentIndex]?.options.map((option, i) => (
          <button
            key={i}
            className={selectedAnswer === i ? "selected" : ""}
            onClick={() => setSelectedAnswer(i)}
          >
            {option}
          </button>
        ))}
      </div>
      <button className="btn play-btn" onClick={handleNext} disabled={selectedAnswer === null}>
        Next
      </button>
    </div>
  );
}

export default PlayQuiz;
