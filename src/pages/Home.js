import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <Link to="/create-quiz" className="btn create-btn">Create Quiz</Link>
      <Link to="/play-quiz" className="btn play-btn">Play Quiz</Link>
    </div>
  );
}

export default Home;
