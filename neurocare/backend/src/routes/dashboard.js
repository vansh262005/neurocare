const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

router.get('/summary', auth, async (req, res) => {
  const totalMessages = await Message.countDocuments({ userId: req.user.id });
  res.json({ moodTrend: [], points: 0, streak: 0, badges: [], totalMessages });
});

module.exports = router;