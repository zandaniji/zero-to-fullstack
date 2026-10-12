// TODO: build the app! Suggested structure (see the README for each step):
//
//   src/
//   ├── api.js                      ✅ provided: api(path, { method, body, token })
//   ├── context/AuthContext.jsx     🟡 started: token, user, login, register, logout
//   ├── components/
//   │   ├── Navbar.jsx              email + "Log out", or "Log in / Sign up" links
//   │   ├── ProtectedRoute.jsx      redirects to /login when there's no user
//   │   ├── TaskForm.jsx            add a task (title + optional due date)
//   │   └── TaskItem.jsx            checkbox, title, due date, delete button
//   ├── hooks/useTasks.js           load / add / toggle / delete tasks
//   └── pages/
//       ├── AuthPage.jsx            one form for both /login and /register
//       ├── Tasks.jsx               the main page, with All / To do / Done filters
//       └── NotFound.jsx

import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <main className="container">
      <h1>✅ TaskFlow</h1>
      <p>{user ? `Logged in as ${user.email}` : "Not logged in yet. Build the login page next!"}</p>
    </main>
  );
}
