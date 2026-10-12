import { useState } from "react";
import { useSearchParams } from "react-router";
import useTasks from "../hooks/useTasks.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "To do" },
  { value: "done", label: "Done" },
];

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks(status);
  const [formError, setFormError] = useState("");

  async function handleAdd(title, dueDate) {
    setFormError("");
    try {
      await addTask(title, dueDate);
      return true;
    } catch (err) {
      setFormError(err.message);
      return false;
    }
  }

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <section>
      <div className="tasks-header">
        <h1>My tasks</h1>
        <div className="filters" role="group" aria-label="Filter tasks">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={status === f.value ? "active" : ""}
              aria-pressed={status === f.value}
              onClick={() => setSearchParams(f.value === "all" ? {} : { status: f.value })}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <TaskForm onAdd={handleAdd} error={formError} />

      {error && <p className="error" role="alert">{error}</p>}
      {loading ? (
        <p className="status">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="status">{status === "done" ? "Nothing finished yet. You've got this! 💪" : "No tasks here. Add one above ✨"}</p>
      ) : (
        <>
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </ul>
          {status === "all" && <p className="status" aria-live="polite">{remaining} left to do</p>}
        </>
      )}
    </section>
  );
}
