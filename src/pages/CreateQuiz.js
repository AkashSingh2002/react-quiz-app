import { useState, useEffect } from "react";
import "./style.css";

function CreateQuiz() {
  const [questions, setQuestions] = useState([]); // ✅ Default to empty array
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctIndex: 0, // Default correct option index
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched questions:", data); // Debugging log
        setQuestions(Array.isArray(data) ? data : []); // ✅ Ensure data is an array
      })
      .catch(err => {
        console.error("Error fetching questions:", err);
        setQuestions([]); // ✅ Prevents undefined errors
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: name === "correctIndex" ? parseInt(value) : value, // Ensure correctIndex is a number
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
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (newQuestion.correctIndex < 0 || newQuestion.correctIndex > 3) {
      alert("Please select a valid correct option (0-3).");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add question: ${errorText}`);
      }

      const addedQuestion = await response.json();
      console.log("✅ Added question:", addedQuestion);

      setQuestions(prev => [...prev, addedQuestion]);

      setNewQuestion({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctIndex: 0,
      });
    } catch (error) {
      console.error("❌ Error adding question:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Create Quiz</h2>

      {/* Form to Add New Question */}
      <div className="quiz-form">
        <input
          type="text"
          name="question"
          placeholder="Enter Question"
          value={newQuestion.question}
          onChange={handleChange}
          className="quiz-input"
        />
        <input
          type="text"
          name="option1"
          placeholder="Option 1"
          value={newQuestion.option1}
          onChange={handleChange}
          className="quiz-input"
        />
        <input
          type="text"
          name="option2"
          placeholder="Option 2"
          value={newQuestion.option2}
          onChange={handleChange}
          className="quiz-input"
        />
        <input
          type="text"
          name="option3"
          placeholder="Option 3"
          value={newQuestion.option3}
          onChange={handleChange}
          className="quiz-input"
        />
        <input
          type="text"
          name="option4"
          placeholder="Option 4"
          value={newQuestion.option4}
          onChange={handleChange}
          className="quiz-input"
        />
        <select
          name="correctIndex"
          value={newQuestion.correctIndex}
          onChange={handleChange}
          className="quiz-select"
        >
          <option value="0">Option 1</option>
          <option value="1">Option 2</option>
          <option value="2">Option 3</option>
          <option value="3">Option 4</option>
        </select>
        <button className="quiz-button" onClick={handleAddQuestion}>
          Add Question
        </button>
      </div>

      {/* Display Questions */}
      {questions.length > 0 ? (
        <ul className="question-list">
          {questions.map(q => (
            <li key={q.id} className="question-item">
              <strong className="question-text">{q.question}</strong>
              {Array.isArray(q.options) ? (
                <ul className="options-list">
                  {q.options.map((opt, i) => (
                    <li key={i} className={`option-item ${i === q.correctIndex ? "correct-option" : ""}`}>
                      {opt} {i === q.correctIndex ? "(Correct)" : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="error-message">⚠️ Error: No options available</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-questions">No questions found.</p>
      )}
    </div>
  );
}

export default CreateQuiz;
