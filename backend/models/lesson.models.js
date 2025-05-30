// models/Lesson.js
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
  videoUrl: {
    type: String, // Cloud storage URL or path
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  resources: [{
    name: String,
    fileUrl: String // PDF, image, audio, etc.
  }],
  order: {
    type: Number, // sequence in the course
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // optional, if quiz exists for the lesson
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);
