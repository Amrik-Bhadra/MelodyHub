const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number,
  },
  resources: [{
    name: String,
    type: { type: String, enum: ['pdf', 'video', 'doc', 'quiz'] },
    fileUrl: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  order: {
    type: Number,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
