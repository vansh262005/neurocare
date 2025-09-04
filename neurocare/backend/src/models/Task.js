const { Schema, model, Types } = require('mongoose');

const taskSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  category: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  status: { type: String, enum: ['assigned', 'completed'], default: 'assigned' },
  imageUrl: { type: String },
  awardedPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('Task', taskSchema);