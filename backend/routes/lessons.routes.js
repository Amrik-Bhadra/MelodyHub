const express = require('express');
const router = express.Router();
const {createLesson, addResource} = require('../controllers/lessons.controller');

router.post('/create/:courseId', createLesson);
router.post('/addResource/:lessonId', addResource);

module.exports = router