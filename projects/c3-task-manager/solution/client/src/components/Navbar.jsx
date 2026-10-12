import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="logo">✅ TaskFlow</Link>
      {user ? (
        <div className="nav-user">
          <span className="email">{user.email}</span>
          <button type="button" className="secondary" onClick={logout}>Log out</button>
        </div>
      ) : (
        <nav>
          <Link to="/login">Log in</Link>
          <Link to="/register" className="button">Sign up</Link>
        </nav>
      )}
    </header>
  );
}
