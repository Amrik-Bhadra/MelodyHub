const express = require('express');
const router = express.Router();

router.post('/create/:courseId', createLesson);

module.exports = router