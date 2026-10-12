import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

// Wrap pages that need a logged-in user. Everyone else goes to /login.
export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <p className="status">Checking your session…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
