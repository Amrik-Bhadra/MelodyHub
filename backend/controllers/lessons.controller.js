// controllers/lessonController.js
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const User = require('../models/User');

const createLesson = async (req, res) => {
    try {
        const instructorId = req.body.instructor_id
        const {
            title,
            description,
            duration,
            order,
            course: courseId,
        } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        if (course.instructor.toString() !== instructorId.toString()) {
            return res.status(403).json({ message: 'Unauthorized: not the course instructor' });
        }

        const existingLesson = await Lesson.findOne({ course: courseId, order });
        if (existingLesson) {
            return res.status(400).json({ message: `Lesson with order ${order} already exists in this course` });
        }

        const newLesson = await Lesson.create({
            title,
            description,
            duration,
            order,
            course: courseId,
        });

        await Course.findByIdAndUpdate(courseId, {
            $push: { lessons: newLesson._id },
        });

        res.status(201).json({
            message: 'Lesson created successfully',
            lesson: newLesson,
        });

    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addLessonResources = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { instructor_id, resources, quiz } = req.body;

    const lesson = await Lesson.findById(lessonId).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    if (lesson.course.instructor.toString() !== instructor_id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: not the course instructor' });
    }

    if (resources && Array.isArray(resources)) {
      lesson.resources.push(...resources);
    }

    if (quiz) {
      lesson.quiz = quiz;
    }

    await lesson.save();

    res.status(200).json({
      message: 'Resources added to lesson successfully',
      lesson,
    });
  } catch (error) {
    console.error('Error adding lesson resources:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    createLesson,
    addLessonResources
}