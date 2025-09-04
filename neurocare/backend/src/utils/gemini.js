const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

let genAI;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

function getChatModel() {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
}

async function generateChatResponse(systemPrompt, messages) {
  const model = getChatModel();
  if (!model) {
    return { text: 'Mock response (provide GEMINI_API_KEY to enable AI)' };
  }
  const result = await model.generateContent({
    contents: [
      { role: 'system', parts: [{ text: systemPrompt }] },
      ...messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }))
    ]
  });
  const response = result.response;
  const text = response.parts?.[0]?.text || '...';
  return { text };
}

module.exports = {
  generateChatResponse
};