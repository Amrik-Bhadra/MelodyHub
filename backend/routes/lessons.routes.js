const express = require('express');
const router = express.Router();
const {createLesson, addResource, deleteResource} = require('../controllers/lessons.controller');

router.post('/create/:courseId', createLesson);
router.post('/addResource/:lessonId', addResource);
router.delete('/:lessonId/resource/:resourceId', deleteResource);

module.exports = router