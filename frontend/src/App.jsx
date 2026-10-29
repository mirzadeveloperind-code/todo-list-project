
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load tasks from Express backend
  async function loadTasks() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Cannot connect to the backend. Check port 5000.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Add a task through the API
  async function addTask(e) {
    e.preventDefault();

    const title = taskInput.trim();
    if (!title) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setTaskInput("");
      await loadTasks();
    } catch (err) {
      setError("Could not add task. Please check the backend.");
      console.error(err);
    }
  }

  // Update task completion through the API
  async function toggleTask(task) {
    try {
      const response = await fetch(
        `${API_URL}/${task.id}/complete`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await loadTasks();
    } catch (err) {
      setError("Could not update task.");
      console.error(err);
    }
  }

  // Delete a task through the API
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await loadTasks();
    } catch (err) {
      setError("Could not delete task.");
      console.error(err);
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <main className="app">
      <section className="todo-card">
        <h1>My To-Do List</h1>
        <p className="subtitle">
          Plan your day, one task at a time.
        </p>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Enter a new task..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="task-summary">
          Total: {tasks.length} | Completed: {completedCount}
        </div>

        {loading ? (
          <p className="empty-message">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="empty-message">
            No tasks yet. Add your first task above!
          </p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className="task-item" key={task.id}>
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                  />
                  <span className={task.completed ? "completed" : ""}>
                    {task.title}
                  </span>
                </label>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
