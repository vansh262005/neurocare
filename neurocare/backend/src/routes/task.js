const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, '..', '..', 'uploads') });

const router = express.Router();

router.post('/assign', auth, async (req, res) => {
  const task = await Task.create({
    userId: req.user.id,
    prompt: 'Take a deep breath and take a picture of something that makes you happy',
    category: 'mental',
    difficulty: 'easy'
  });
  res.json(task);
});

router.post('/complete/:id', auth, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const task = await Task.findOne({ _id: id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  task.status = 'completed';
  task.imageUrl = `/uploads/${req.file.filename}`;
  task.awardedPoints = 10;
  await task.save();
  res.json(task);
});

module.exports = router;