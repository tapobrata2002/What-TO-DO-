
const express = require("express");
const router = express.Router();

const Task = require("../models/Task");

// GET - Fetch all tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST - Create a new task
router.post("/", async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT - Update an existing task
router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Delete a task
router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
