import { Link } from "react-router";
import FavoriteButton from "./FavoriteButton.jsx";

export default function RecipeCard({ meal }) {
  return (
    <article className="card">
      <Link to={`/recipe/${meal.idMeal}`} className="card-link">
        <img src={`${meal.strMealThumb}/medium`} alt="" loading="lazy" />
        <h3>{meal.strMeal}</h3>
        <p className="meta">{[meal.strCategory, meal.strArea].filter(Boolean).join(" · ")}</p>
      </Link>
      <FavoriteButton meal={meal} />
    </article>
  );
}
