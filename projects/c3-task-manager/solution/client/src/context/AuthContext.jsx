import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "task-manager-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(token)); // verifying a saved token?

  // Keep the token in localStorage so a page reload doesn't log you out.
  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  // On first load, check that a saved token is still valid.
  useEffect(() => {
    if (!token || user) return;
    let cancelled = false;
    api("/api/auth/me", { token })
      .then((data) => !cancelled && setUser(data.user))
      .catch(() => !cancelled && setToken(null))
      .finally(() => !cancelled && setChecking(false));
    return () => { cancelled = true; };
  }, [token, user]);

  async function authenticate(mode, email, password) {
    const data = await api(`/api/auth/${mode}`, { method: "POST", body: { email, password } });
    setToken(data.token);
    setUser(data.user);
  }

  // useCallback keeps the same function between renders. Hooks that list
  // `logout` as a dependency (like useTasks) would otherwise re-run every render.
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    checking,
    login: (email, password) => authenticate("login", email, password),
    register: (email, password) => authenticate("register", email, password),
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
