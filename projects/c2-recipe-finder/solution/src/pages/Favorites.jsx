import { Link } from "react-router";
import { useFavorites } from "../context/FavoritesContext.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <>
      <h1>Your favorites</h1>
      {favorites.length === 0 ? (
        <p className="status">
          No favorites yet. <Link to="/">Find a recipe</Link> and tap ♡ to save it here.
        </p>
      ) : (
        <RecipeGrid meals={favorites} />
      )}
    </>
  );
}
