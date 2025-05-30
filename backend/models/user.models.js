const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },

  // favourites: [{
  //   type: String,
  //   default: null
  // }],

  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
    }
  ],

  teachingCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }
  ],

  certificates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
    }
  ],

}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
