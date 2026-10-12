import { useFavorites } from "../context/FavoritesContext.jsx";

export default function FavoriteButton({ meal }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(meal.idMeal);

  return (
    <button
      type="button"
      className={`fav-button ${saved ? "saved" : ""}`}
      onClick={() => toggleFavorite(meal)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${meal.strMeal} from favorites` : `Add ${meal.strMeal} to favorites`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
