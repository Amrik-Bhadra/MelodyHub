const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number, // e.g., percentage completion
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    default: null
  }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
