import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useFetch from "../hooks/useFetch.js";
import { randomUrl, searchUrl } from "../api.js";
import RecipeGrid from "../components/RecipeGrid.jsx";

export default function Home() {
  // The search lives in the URL (?q=pasta), so it survives reloads and can be shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [input, setInput] = useState(query);
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(query ? searchUrl(query) : null);
  const meals = data?.meals ?? [];   // TheMealDB returns { meals: null } when nothing matches

  function handleSubmit(e) {
    e.preventDefault();
    const q = input.trim();
    setSearchParams(q ? { q } : {});
  }

  async function surpriseMe() {
    const res = await fetch(randomUrl());
    const json = await res.json();
    navigate(`/recipe/${json.meals[0].idMeal}`);
  }

  return (
    <>
      <section className="hero">
        <h1>What do you feel like cooking?</h1>
        <form className="search" onSubmit={handleSubmit} role="search">
          <label htmlFor="q" className="visually-hidden">Search recipes</label>
          <input
            id="q"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try “pasta”, “curry” or “cake”"
          />
          <button type="submit">Search</button>
        </form>
        <button type="button" className="link-button" onClick={surpriseMe}>
          🎲 Surprise me
        </button>
      </section>

      {loading && <p className="status">Loading recipes…</p>}
      {error && <p className="status error" role="alert">Couldn't load recipes: {error}</p>}
      {!loading && query && !error && meals.length === 0 && (
        <p className="status">No recipes found for “{query}”. Try another word.</p>
      )}
      {!loading && meals.length > 0 && (
        <>
          <p className="status">{meals.length} recipes for “{query}”</p>
          <RecipeGrid meals={meals} />
        </>
      )}
    </>
  );
}
