import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="status">
      <h1>404: Page not found</h1>
      <Link to="/">Back to your tasks</Link>
    </div>
  );
}
