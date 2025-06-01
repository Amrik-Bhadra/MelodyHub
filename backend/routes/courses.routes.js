const express = require('express');
const router = express.Router();

const { getAllCourses, getAllCoursesByInstructor, createCourse, updateCourse, deleteCourse, getCourseDetails} = require('../controllers/courses.controller');

// get all courses
router.get('/', getAllCourses);

// get course data by id
router.get('/:courseId', getCourseDetails)

// get courses of instructor
router.get('/instructor/:id', getAllCoursesByInstructor);

// create new course
router.post('/create', createCourse);

// Update a course
router.put('/update/:courseId', updateCourse);

// Delete a course
router.delete('/delete/:courseId/:instructorId', deleteCourse);

module.exports = router;