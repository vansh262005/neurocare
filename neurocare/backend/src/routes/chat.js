const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

const chatSchema = z.object({
  text: z.string()
});

router.post('/', auth, async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { id } = req.user;

  // Save user message
  const userMsg = await Message.create({ userId: id, role: 'user', text: parsed.data.text });

  // Placeholder Gemini call
  const assistantText = process.env.GEMINI_API_KEY ?
    `Gemini would respond to: ${parsed.data.text}` :
    `Mock response (provide GEMINI_API_KEY to enable AI)`;

  // Save assistant message
  const assistantMsg = await Message.create({ userId: id, role: 'assistant', text: assistantText });

  res.json({ messages: [userMsg, assistantMsg] });
});

module.exports = router;