import { useState } from "react";
import { useNavigate } from "react-router-dom";
import generateQuestions from "../utils/generateQuestions";

function CreateQuiz() {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(4);

  const handleCreateQuiz = () => {
    localStorage.setItem("quizQuestions", JSON.stringify(generateQuestions(questionCount)));
    navigate("/");
  };

  return (
    <div className="quiz-container">
      <h2>Choose Number of Questions</h2>
      <div className="button-group">
        {[4, 5].map(num => (
          <button
            key={num}
            className={questionCount === num ? "selected" : ""}
            onClick={() => setQuestionCount(num)}
          >
            {num}
          </button>
        ))}
      </div>
      <button className="btn create-btn" onClick={handleCreateQuiz}>Create Quiz</button>
    </div>
  );
}

export default CreateQuiz;
