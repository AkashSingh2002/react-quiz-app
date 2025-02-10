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

  if (showResult) return <div className="result-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center" }}><h2>🎉 Quiz Completed!</h2><p>Great job on finishing the quiz.</p><button className="btn restart-btn" onClick={() => window.location.reload()}>Restart Quiz</button></div>;

  return (
    <div className="quiz-container">
  <div className="quiz-box">
    <h2>{questions[currentIndex]?.question}</h2>

    <div className="options-container">
      {questions[currentIndex]?.options.map((option, i) => (
        <button
          key={i}
          className={`option-btn ${selectedAnswer === i ? "selected" : ""}`}
          onClick={() => setSelectedAnswer(i)}
        >
          {option}
        </button>
      ))}
    </div>

    <button className="btn next-btn" onClick={handleNext} disabled={selectedAnswer === null}>
      Next
    </button>
  </div>
</div>
  );
}

export default PlayQuiz;
