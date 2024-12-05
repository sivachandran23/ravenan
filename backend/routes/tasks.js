const express = require('express');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

const router = express.Router();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

router.use(authenticate);

router.get('/', async (req, res) => {
    const tasks = await Task.find({ user_id: req.user.id });
    res.json(tasks);
});

router.post('/', async (req, res) => {
    const { title, description, due_date, status } = req.body;
    const newTask = new Task({ user_id: req.user.id, title, description, due_date, status });
    await newTask.save();
    res.json(newTask);
});

router.put('/:id', async (req, res) => {
    const { title, description, due_date, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title, description, due_date, status }, { new: true });
    res.json(updatedTask);
});

router.delete('/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
