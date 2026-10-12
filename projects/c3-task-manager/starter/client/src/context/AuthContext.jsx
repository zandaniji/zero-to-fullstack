import { createContext, useCallback, useContext, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // TODO: save the token in localStorage (useEffect on [token]) and read it back
  //       in useState(() => localStorage.getItem(...)) so a reload keeps you logged in.

  // TODO: when there's a saved token but no user yet, call GET /api/auth/me to
  //       check it's still valid (log out on failure). Track a `checking` flag.

  async function login(email, password) {
    const data = await api("/api/auth/login", { method: "POST", body: { email, password } });
    setToken(data.token);
    setUser(data.user);
  }

  // TODO: register(email, password), which is almost identical to login

  // useCallback keeps the same function between renders (important if hooks
  // list `logout` as a dependency).
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
