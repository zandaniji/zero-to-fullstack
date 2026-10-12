import { Link, useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch.js";
import { getIngredients, recipeUrl } from "../api.js";
import FavoriteButton from "../components/FavoriteButton.jsx";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(recipeUrl(id));
  const meal = data?.meals?.[0];

  if (loading) return <p className="status">Loading recipe…</p>;
  if (error) return <p className="status error" role="alert">Couldn't load this recipe: {error}</p>;
  if (!meal) {
    return (
      <p className="status">
        Recipe not found. <Link to="/">Back to search</Link>
      </p>
    );
  }

  const steps = meal.strInstructions.split(/\r?\n/).filter((line) => line.trim());

  return (
    <article className="detail">
      <button type="button" className="link-button back" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-header">
        <img src={meal.strMealThumb} alt={meal.strMeal} />
        <div>
          <p className="meta">{meal.strCategory} · {meal.strArea}</p>
          <h1>{meal.strMeal}</h1>
          <FavoriteButton meal={meal} />
          {meal.strYoutube && (
            <p>
              <a href={meal.strYoutube} target="_blank" rel="noreferrer">▶ Watch on YouTube</a>
            </p>
          )}
        </div>
      </div>

      <div className="detail-body">
        <section>
          <h2>Ingredients</h2>
          <ul className="ingredients">
            {getIngredients(meal).map(({ ingredient, measure }) => (
              <li key={ingredient}>
                <span>{ingredient}</span>
                <span className="measure">{measure}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Method</h2>
          <ol className="steps">
            {steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
