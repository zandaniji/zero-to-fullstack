import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

// All task data and actions in one custom hook, so the page component stays simple.
export default function useTasks(status) {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Wrap every call: if the token has expired (401), log out.
  const call = useCallback(
    async (path, options = {}) => {
      try {
        return await api(path, { ...options, token });
      } catch (err) {
        if (err.status === 401) logout();
        throw err;
      }
    },
    [token, logout]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setTasks(await call(`/api/tasks?status=${status}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [call, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function addTask(title, dueDate) {
    await call("/api/tasks", { method: "POST", body: { title, dueDate: dueDate || null } });
    await load();
  }

  async function toggleTask(task) {
    // Optimistic update: change the screen right away, then tell the server.
    setTasks((current) => current.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
    try {
      await call(`/api/tasks/${task.id}`, { method: "PATCH", body: { done: !task.done } });
    } finally {
      await load();
    }
  }

  async function deleteTask(task) {
    setTasks((current) => current.filter((t) => t.id !== task.id));
    try {
      await call(`/api/tasks/${task.id}`, { method: "DELETE" });
    } catch (err) {
      setError(err.message);
      await load();
    }
  }

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
}
