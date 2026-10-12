function formatDue(dueDate) {
  if (!dueDate) return null;
  const today = new Date().toISOString().slice(0, 10);
  const label = new Date(dueDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return { label, overdue: dueDate < today };
}

export default function TaskItem({ task, onToggle, onDelete }) {
  const due = formatDue(task.dueDate);
  const checkboxId = `task-${task.id}`;

  return (
    <li className={`task ${task.done ? "done" : ""}`}>
      <input id={checkboxId} type="checkbox" checked={task.done} onChange={() => onToggle(task)} />
      <label htmlFor={checkboxId}>{task.title}</label>
      {due && (
        <span className={`due ${due.overdue && !task.done ? "overdue" : ""}`}>
          {due.overdue && !task.done ? "Overdue · " : "Due "}
          {due.label}
        </span>
      )}
      <button type="button" className="delete" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
        ✕
      </button>
    </li>
  );
}
