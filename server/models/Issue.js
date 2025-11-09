const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Pothole', 'Garbage', 'Water Leak', 'Street Light', 'Other'],
    required: true 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  mediaURLs: [String],
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priorityScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proofBefore: String,
  proofAfter: String,
  resolvedAt: Date
});

module.exports = mongoose.model('Issue', issueSchema);