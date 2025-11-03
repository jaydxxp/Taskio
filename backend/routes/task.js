const express = require('express');
const router = express.Router();
const Task = require('../model/task');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || process.env.jwt;


router.get('/', async (req, res) => {
  try {
   
    let ownerId = null;
    try {
      const authHeader = req.headers.authorization || req.headers['x-access-token'] || '';
      const token = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
        ? authHeader.split(' ')[1]
        : authHeader;
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        ownerId = decoded.id || decoded.uid || decoded.userId || null;
      }
    } catch (e) {
      
      ownerId = null;
    }

    if (!ownerId && req.query && req.query.ownerId) {
      ownerId = req.query.ownerId;
    }

    let tasks;
    if (ownerId) {
      
      tasks = await Task.find({ creator: ownerId }).lean();
    } else {
      
      tasks = await Task.find({}).lean();
    }

    return res.json(tasks);
  } catch (err) {
    console.error('Get tasks error', err);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

router.post('/create', authenticate, async (req, res) => {
  try {
    const { title, description = '', status = 'todo', priority = 'Medium', assignee, dueDate, subtasks } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const creatorId = req.user && (req.user._id || req.user.id);
    const task = new Task({
      title,
      description,
      status,
      priority,
      creator: creatorId,
      assignee: assignee || null,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      subtasks: Array.isArray(subtasks) ? subtasks : []
    });

    task.activities = task.activities || [];
    task.activities.push({
      actor: creatorId,
      action: 'create',
      payload: { title: task.title, status: task.status },
      createdAt: new Date()
    });

    await task.save();
    return res.status(201).json(task);
  } catch (err) {
    console.error('Create task error', err);
    return res.status(500).json({ message: 'Failed to create task' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    let actorId = null;
    try {
      const authHeader = req.headers.authorization || req.headers['x-access-token'] || '';
      const token = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
        ? authHeader.split(' ')[1]
        : authHeader;
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        actorId = decoded.userId || decoded.id || decoded.uid || null;
      }
    } catch (e) {

    }

 
    const changes = {};
    for (const key of Object.keys(updates)) {
      const before = (task[key] !== undefined) ? task[key] : null;
      const after = updates[key];
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        changes[key] = { from: before, to: after };
        task[key] = after;
      }
    }

    if (Object.keys(changes).length > 0) {
      task.activities = task.activities || [];
      task.activities.push({
        actor: actorId,
        action: 'update',
        payload: { changes },
        createdAt: new Date()
      });
    }

    await task.save();
    return res.json(task);
  } catch (err) {
    console.error('Update task error', err);
    return res.status(500).json({ message: 'Failed to update task' });
  }
});

router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });

    
    let actorId = null;
    try {
      const authHeader = req.headers.authorization || req.headers['x-access-token'] || '';
      const token = (typeof authHeader === 'string' && authHeader.startsWith('Bearer '))
        ? authHeader.split(' ')[1]
        : authHeader;
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        actorId = decoded.userId || decoded.id || decoded.uid || null;
      }
    } catch (e) {
      
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      text: text.trim(),
      authorId: actorId,
      createdAt: new Date()
    };

    task.activities = task.activities || [];
    task.activities.push({
      actor: actorId,
      action: 'comment',
      payload: { comment },
      createdAt: new Date()
    });

    task.comments = (task.comments || 0) + 1;
    await task.save();

    return res.status(201).json(comment);
  } catch (err) {
    console.error('Add comment error', err);
    return res.status(500).json({ message: 'Failed to add comment' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error', err);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
});

module.exports = router;
