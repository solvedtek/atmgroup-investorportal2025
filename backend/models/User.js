const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // We'll need this later for password hashing

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Do not return password by default
  },
  role: {
    type: String,
    enum: ['investor', 'admin'], // Define possible roles
    default: 'investor',
  },
  preferences: {
    // Example structure, adjust as needed
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add updatedAt if needed, Mongoose timestamps: true can also handle this
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

// TODO: Add pre-save middleware hook here later to hash password using bcrypt

module.exports = mongoose.model('User', UserSchema);