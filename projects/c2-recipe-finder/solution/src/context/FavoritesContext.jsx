import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { toSummary } from "../api.js";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  const isFavorite = (id) => favorites.some((f) => f.idMeal === id);

  function toggleFavorite(meal) {
    setFavorites((current) =>
      current.some((f) => f.idMeal === meal.idMeal)
        ? current.filter((f) => f.idMeal !== meal.idMeal)
        : [...current, toSummary(meal)]
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// A small custom hook so components don't import the context directly.
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
