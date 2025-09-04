const { Schema, model, Types } = require('mongoose');

const crisisEventSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  alertEmailSent: { type: Boolean, default: false },
  alertSmsSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = model('CrisisEvent', crisisEventSchema);