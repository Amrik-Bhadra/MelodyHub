const express = require('express');
const router = express.Router();

const { getAllCourses, getAllCoursesByInstructor, createCourse, updateCourse, deleteCourse,  } = require('../controllers/courses.controller');

// get all courses
router.get('/', getAllCourses);

// get courses of instructor
router.get('/instructor', getAllCoursesByInstructor);

// create new course
router.post('/create', createCourse);

// Update a course
router.put('/:courseId', updateCourse);

// Delete a course
router.delete('/:courseId', deleteCourse);

module.exports = router;