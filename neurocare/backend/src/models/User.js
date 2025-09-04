const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: {
    tone: { type: String, default: 'gentle' },
    goals: [String]
  },
  streak: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  badges: [String]
}, { timestamps: true });

module.exports = model('User', userSchema);