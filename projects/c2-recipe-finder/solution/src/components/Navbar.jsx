import { Link, NavLink } from "react-router";
import { useFavorites } from "../context/FavoritesContext.jsx";

export default function Navbar() {
  const { favorites } = useFavorites();

  return (
    <header className="navbar">
      <Link to="/" className="logo">🍲 Recipe Finder</Link>
      <nav>
        <NavLink to="/" end>Search</NavLink>
        <NavLink to="/favorites">
          Favorites <span className="count">{favorites.length}</span>
        </NavLink>
      </nav>
    </header>
  );
}
