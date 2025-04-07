const mongoose = require('mongoose');

const ExportJobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  filePath: { type: String },
  downloadToken: { type: String, unique: true },
  expiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('ExportJob', ExportJobSchema);