const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  text: { type: String, required: true },
  emotion: { type: String },
}, { timestamps: true });

module.exports = model('Message', messageSchema);