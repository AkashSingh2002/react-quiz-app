import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import PlayQuiz from "./pages/PlayQuiz";
import Login from "./components/Login";
import Register from "./components/Register";
import Quiz from "./pages/quiz";
import Dashboard from "./components/Dashboard";
import QuizDetail from "./components/QuizDetail";
import QuizHistory from "./components/QuizHistory";
import "./styles.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quiz-detail/:id" element={<QuizDetail />} />
          <Route path="/quiz-history" element={<QuizHistory />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/play-quiz" element={<PlayQuiz />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
