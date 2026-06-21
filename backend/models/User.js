const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
    },
    bio: {
      type: String,
      default: '',
    },
    avatarInitials: {
      type: String,
      default: function () {
        // Auto-generate initials from fullname, e.g. "John Doe" -> "JD"
        return this.fullname
          ? this.fullname
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : '';
      },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('User', userSchema);