const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Password hashing

const UserSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

/**
 * Hash password before saving
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
