const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema]
});

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  instructions: {
    type: String
  },
  questions: [questionSchema],
  duration: {
    type: Number, // in minutes
    default: 15
  },
  passingScore: {
    type: Number, // e.g., 70 for 70%
    default: 70
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
