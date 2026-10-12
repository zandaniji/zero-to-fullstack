import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="status">
      <h1>404: Page not found</h1>
      <p>
        That page doesn't exist. <Link to="/">Go back home</Link>
      </p>
    </div>
  );
}
