import { useState } from "react";

export default function TaskForm({ onAdd, error }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const ok = await onAdd(title.trim(), dueDate);
    setSaving(false);
    if (ok) {
      setTitle("");
      setDueDate("");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="new-task" className="visually-hidden">New task</label>
      <input
        id="new-task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
      />
      <label htmlFor="due-date" className="visually-hidden">Due date (optional)</label>
      <input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button type="submit" disabled={saving || !title.trim()}>
        {saving ? "Adding…" : "Add"}
      </button>
      {error && <p className="error form-error" role="alert">{error}</p>}
    </form>
  );
}
