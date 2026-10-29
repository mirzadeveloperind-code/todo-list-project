
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB task model
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

// Format MongoDB documents for the existing React frontend
function formatTask(task) {
  return {
    id: task._id.toString(),
    title: task.title,
    completed: task.completed,
  };
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks.map(formatTask));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Get one task
app.get("/api/tasks/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(formatTask(task));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({ title });
    res.status(201).json(formatTask(task));
  } catch (error) {
    res.status(500).json({ message: "Failed to create task" });
  }
});

// Update a task title
app.put("/api/tasks/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(formatTask(task));
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
});

// Toggle task completion
app.patch("/api/tasks/:id/complete", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    await task.save();

    res.json(formatTask(task));
  } catch (error) {
    res.status(500).json({ message: "Failed to update completion" });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// Start server only after MongoDB connects
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected to MongoDB successfully!");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
