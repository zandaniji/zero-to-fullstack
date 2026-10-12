import RecipeCard from "./RecipeCard.jsx";

export default function RecipeGrid({ meals }) {
  return (
    <div className="grid">
      {meals.map((meal) => (
        <RecipeCard key={meal.idMeal} meal={meal} />
      ))}
    </div>
  );
}
