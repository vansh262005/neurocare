function detectEmotion(text) {
  const lower = text.toLowerCase();
  if (/\b(sad|depressed|unhappy|down)\b/.test(lower)) return 'sad';
  if (/\b(happy|joy|glad|excited)\b/.test(lower)) return 'happy';
  if (/\b(stress|anxious|anxiety|nervous)\b/.test(lower)) return 'anxious';
  if (/\b(angry|mad|furious)\b/.test(lower)) return 'angry';
  return 'neutral';
}
module.exports = { detectEmotion };