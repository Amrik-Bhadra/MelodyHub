// controllers/lessonController.js
const Lesson = require('../models/lesson.models');
const Course = require('../models/course.models');
const User = require('../models/user.models');

const createLesson = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const instructorId = req.body.instructorId
        const {
            title,
            order
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
            order,
            course: courseId,
        });

        await Course.findByIdAndUpdate(courseId, {
            $push: { lessons: newLesson._id },
        });

        res.status(201).json({
            message: 'Lesson created successfully',
        });

    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addResource = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { instructorId, title, type } = req.body;

    console.log(`Lesson id: ${lessonId}, title: ${title}, type: ${type}`);

    const lesson = await Lesson.findById(lessonId).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    if (lesson.course.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: not the course instructor' });
    }

    // Add the resource
    lesson.resources.push({
      name: title,
      type: type,
    });

    await lesson.save();

    res.status(200).json({
      message: 'Resource added to lesson successfully',
      lesson,
    });
  } catch (error) {
    console.error('Error adding lesson resources:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
    createLesson,
    addResource
}