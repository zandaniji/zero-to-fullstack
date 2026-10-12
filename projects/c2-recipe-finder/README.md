# Capstone 2: Recipe Finder (React + Vite + React Router)

A multi-page React app that searches thousands of recipes using the free [TheMealDB API](https://www.themealdb.com/api.php) (no key needed).

**Pages**

- `/`: search recipes, with the search saved in the URL (`/?q=pasta`) and a 🎲 "Surprise me" button
- `/recipe/:id`: photo, ingredients, step-by-step method and a YouTube link
- `/favorites`: your saved recipes, kept in `localStorage`
- `*`: a friendly 404 page

**What it practises:** components and props, `useState`, `useEffect` and a custom `useFetch` hook, React Router (routes, `Link`/`NavLink`, `useParams`, `useSearchParams`, `useNavigate`), context for app-wide favorites, a `useLocalStorage` hook, loading and error states, and responsive, accessible CSS.

## Build it yourself

```bash
npm create vite@latest recipe-finder -- --template react
cd recipe-finder
npm install
npm install react-router
npm run dev
```

Then follow the five parts in the course (Capstone 2 in the learning app). Each part tells you what to build and which files to create.

## API cheatsheet

```
Search:  https://www.themealdb.com/api/json/v1/1/search.php?s=pasta   → { meals: [...] }  (or { meals: null })
Details: https://www.themealdb.com/api/json/v1/1/lookup.php?i=52771   → { meals: [meal] }
Random:  https://www.themealdb.com/api/json/v1/1/random.php           → { meals: [meal] }
```

Each meal has `idMeal`, `strMeal`, `strMealThumb`, `strCategory`, `strArea`, `strInstructions`, `strYoutube`, and ingredients spread across `strIngredient1`–`strIngredient20` and `strMeasure1`–`strMeasure20`.

## Run the finished solution

```bash
cd solution
npm install
npm run dev
```
