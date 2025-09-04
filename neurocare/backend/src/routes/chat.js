const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const safetyGuard = require('../middleware/safetyGuard');
const Message = require('../models/Message');
const { detectEmotion } = require('../utils/emotion');
const { generateChatResponse } = require('../utils/gemini');

const router = express.Router();

const chatSchema = z.object({
  text: z.string()
});

router.post('/', auth, safetyGuard, async (req, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const { id } = req.user;
  const userText = parsed.data.text;

  // Detect emotion
  const emotion = detectEmotion(userText);

  // Save user message
  await Message.create({ userId: id, role: 'user', text: userText, emotion });

  // Short-term memory: last 20 messages
  const history = await Message.find({ userId: id }).sort({ createdAt: -1 }).limit(20).lean();
  const formattedHistory = history.reverse().map((m) => ({ role: m.role, text: m.text }));

  // System prompt
  const systemPrompt = `You are Neurocare, an empathetic mental-health companion. Respond in a warm, conversational tone. The user's current emotion is ${emotion}. Adjust your tone accordingly and provide supportive, actionable suggestions. Keep responses concise (max 120 words).`;

  // Generate response via Gemini (or fallback)
  const { text: assistantText } = await generateChatResponse(systemPrompt, formattedHistory.concat({ role: 'user', text: userText }));

  // Save assistant message
  await Message.create({ userId: id, role: 'assistant', text: assistantText });

  res.json({ emotion, assistantText });
});

module.exports = router;