import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    logout(); // Call the logout function to update state and remove token
    navigate("/"); // Redirect to the home page after logging out
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Quiz App</Link>
      <div>
        {!isLoggedIn ? (
          <>
            <Link to="/register" className="register-btn">Register</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </>
        ) : (
          <div className="button-group">
          <Link to="/dashboard" className="login-btn">Dashboard</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
