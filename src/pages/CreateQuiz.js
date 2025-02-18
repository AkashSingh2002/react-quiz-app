import { useState, useEffect } from "react";
import "./createQuiz.css";

function CreateQuiz() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", ""], // Minimum 2 options
    correctIndex: 0,
  });

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(Array.isArray(data) ? data : []))
      .catch((err) => setQuestions([]));
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "question") {
      setNewQuestion((prev) => ({ ...prev, question: value }));
    } else if (name === "correctIndex") {
      setNewQuestion((prev) => ({ ...prev, correctIndex: parseInt(value) }));
    } else if (index !== null) {
      setNewQuestion((prev) => {
        const updatedOptions = [...prev.options];
        updatedOptions[index] = value;
        return { ...prev, options: updatedOptions };
      });
    }
  };

  const addOption = () => {
    if (newQuestion.options.length < 4) {
      setNewQuestion((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }));
    }
  };

  const removeOption = (index) => {
    if (newQuestion.options.length > 2) {
      setNewQuestion((prev) => {
        const updatedOptions = prev.options.filter((_, i) => i !== index);
        return { ...prev, options: updatedOptions };
      });
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question || newQuestion.options.some((opt) => !opt)) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error("Failed to add question");

      const addedQuestion = await response.json();
      setQuestions((prev) => [...prev, addedQuestion]);

      setNewQuestion({ question: "", options: ["", ""], correctIndex: 0 });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Create Quiz</h2>

      <div className="quiz-form">
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={newQuestion.question}
          onChange={handleChange}
          className="quiz-input"
        />

        {newQuestion.options.map((opt, index) => (
          <div key={index} className="option-row">
            <input
              type="text"
              value={opt}
              onChange={(e) => handleChange(e, index)}
              placeholder={`Option ${index + 1}`}
              className="quiz-option"
            />
            {newQuestion.options.length > 2 && (
              <button onClick={() => removeOption(index)} className="remove-option">
                ❌
              </button>
            )}
          </div>
        ))}

        {newQuestion.options.length < 4 && (
          <button onClick={addOption} className="add-option">➕ Add Option</button>
        )}

        <select
          name="correctIndex"
          value={newQuestion.correctIndex}
          onChange={handleChange}
          className="quiz-select"
        >
          {newQuestion.options.map((_, index) => (
            <option key={index} value={index}>Option {index + 1}</option>
          ))}
        </select>

        <button className="quiz-button" onClick={handleAddQuestion}>
          Add Question
        </button>
      </div>

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
