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
      <select 
        className="dropdown" 
        value={questionCount} 
        onChange={(e) => setQuestionCount(Number(e.target.value))}
      >
        {[4, 5, 6, 7, 8, 9, 10].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <button className="btn create-btn" onClick={handleCreateQuiz}>Create Quiz</button>
    </div>
  );
}

export default CreateQuiz;
