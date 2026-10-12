// All the TheMealDB URLs in one place. Docs: https://www.themealdb.com/api.php
const BASE = "https://www.themealdb.com/api/json/v1/1";

export const searchUrl = (query) => `${BASE}/search.php?s=${encodeURIComponent(query)}`;
export const recipeUrl = (id) => `${BASE}/lookup.php?i=${encodeURIComponent(id)}`;
export const randomUrl = () => `${BASE}/random.php`;

// TheMealDB stores ingredients as strIngredient1..20 + strMeasure1..20.
// Turn them into a tidy array: [{ ingredient: "Penne", measure: "1 lb" }, ...]
export function getIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      list.push({ ingredient: ingredient.trim(), measure: (measure || "").trim() });
    }
  }
  return list;
}

// Keep only the fields the cards need (that's all we save in favorites).
export function toSummary(meal) {
  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
  };
}
