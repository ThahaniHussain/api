const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// file path for tasks.json
const dataFile = path.join(__dirname, "data", "tasks.json");

// Ensure tasks.json exists
if (!fs.existsSync("data")) fs.mkdirSync("data");
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));

// ✅ Task 1: Create a new task
app.post("/api/tasks", (req, res) => {
  const { title, description, priority } = req.body;

  // validation
  if (!title || !priority) {
    return res.status(400).json({ error: "Title and priority are required" });
  }
  const validPriorities = ["low", "medium", "high", "urgent"];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: "Priority must be low, medium, high, or urgent" });
  }

  // load existing tasks
  const data = fs.readFileSync(dataFile);
  const tasks = JSON.parse(data);

  const newTask = {
    taskId: "TASK-" + Date.now(),
    title,
    description: description || "",
    priority,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));

  res.status(201).json(newTask);
});

// ✅ Task 2: Get all tasks
app.get("/api/tasks", (req, res) => {
  try {
    const data = fs.readFileSync(dataFile);
    const tasks = JSON.parse(data);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Could not read tasks file" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ TaskFlow API is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
