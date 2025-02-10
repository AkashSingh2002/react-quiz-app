import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Quiz App</h1>
      <p>Test your knowledge or create your own quiz!</p>
      <div className="button-group">
        <Link to="/create-quiz" className="btn create-btn">Create Quiz</Link>
        <Link to="/play-quiz" className="btn play-btn">Play Quiz</Link>
      </div>
    </div>
  );
}

export default Home;
