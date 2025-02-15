import { useState, useEffect } from "react";
import "./createQuiz.css"

function CreateQuiz() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctIndex: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then(res => res.json())
      .then(data => setQuestions(Array.isArray(data) ? data : []))
      .catch(err => setQuestions([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: name === "correctIndex" ? parseInt(value) : value,
    }));
  };

  const handleAddQuestion = async () => {
    if (
      !newQuestion.question ||
      !newQuestion.option1 ||
      !newQuestion.option2 ||
      !newQuestion.option3 ||
      !newQuestion.option4
    ) {
      alert("Please fill in all fields.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });
  
      if (!response.ok) throw new Error("Failed to add question");
  
      const addedQuestion = await response.json();
  
      // ✅ Ensure options array exists before adding to state
      const formattedQuestion = {
        ...addedQuestion,
        options: [
          addedQuestion.option1,
          addedQuestion.option2,
          addedQuestion.option3,
          addedQuestion.option4,
        ],
      };
  
      setQuestions(prev => [...prev, formattedQuestion]);
  
      // Reset form
      setNewQuestion({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctIndex: 0,
      });
    } catch (error) {
      alert(error.message);
    }
  };
  

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Create Quiz</h2>

      {/* Compact Form */}
      <div className="quiz-form">
        <input type="text" name="question" placeholder="Question" value={newQuestion.question} onChange={handleChange} className="quiz-input" />
        <div className="options-row">
          <input type="text" name="option1" placeholder="Option 1" value={newQuestion.option1} onChange={handleChange} className="quiz-option" />
          <input type="text" name="option2" placeholder="Option 2" value={newQuestion.option2} onChange={handleChange} className="quiz-option" />
        </div>
        <div className="options-row">
          <input type="text" name="option3" placeholder="Option 3" value={newQuestion.option3} onChange={handleChange} className="quiz-option" />
          <input type="text" name="option4" placeholder="Option 4" value={newQuestion.option4} onChange={handleChange} className="quiz-option" />
        </div>
        <select name="correctIndex" value={newQuestion.correctIndex} onChange={handleChange} className="quiz-select">
          <option value="0">Option 1</option>
          <option value="1">Option 2</option>
          <option value="2">Option 3</option>
          <option value="3">Option 4</option>
        </select>
        <button className="quiz-button" onClick={handleAddQuestion}>Add Question</button>
      </div>

      {/* Display Questions */}
      {questions.length > 0 ? (
  <div className="quiz-container">
    {questions.map((q, index) => (
      <div key={q.id || index} className="question-card">
        <div className="question-text">{q.question || "No question provided"}</div>
        
        {Array.isArray(q.options) && q.options.length > 0 ? (
          <div className="options-container">
            {q.options.map((opt, i) => (
              <div key={i} className={`option-box ${i === q.correctIndex ? "correct" : ""}`}>
                {opt || "N/A"}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "red" }}>⚠️ No options available</p>
        )}
      </div>
    ))}
  </div>
) : (
  <p>No questions found.</p>
)}
    </div>
  );
}

export default CreateQuiz;
