import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    setIsRegistered(true);
    alert("Registered Successfully");
  }
  const handleLogin = () => {
    if(!isRegistered){
      alert("Please Register before Log in ");
    }
    else{
      setIsLoggedIn(true);
    }
  }
  const handleLogout = () => {
    setIsLoggedIn(false);
  }

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
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
