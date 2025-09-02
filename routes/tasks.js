const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authenticateFirebase = require("../middleware/firebaseAuth");

router.use(authenticateFirebase);

// GET all tasks for logged-in user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.uid });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST create new task
router.post("/", async (req, res) => {
  try {
    const newTask = new Task({
      ...req.body,
      userId: req.user.uid
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Edit task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Invalid task data" });
  }
});

// DELETE - Delete task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid task ID" });
  }
});

// PATCH - Change task status
router.patch("/:id/status", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = req.body.status || task.status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Invalid task ID" });
  }
});

module.exports = router;
