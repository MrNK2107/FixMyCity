const mongoose = require('mongoose');

const cosignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
  comment: String,
  evidenceURL: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cosign', cosignSchema);