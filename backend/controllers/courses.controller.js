const User = require('../models/user.models');
const Course = require('../models/course.models.js');
const Lesson = require('../models/lesson.models.js');
const Enrollment = require('../models/enrollment.models.js');
const Certificate = require('../models/certificate.models.js');
const Quiz = require('../models/quiz.models.js');


const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lessons = await Promise.all(
      course.lessons.map((lessonId) => Lesson.findById(lessonId))
    );

    res.status(200).json({
      course,
      lessons,
    });
  } catch (err) {
    console.error('Error fetching course details:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// get all courses
const getAllCourses = async (req, res) => {

}

// get all courses created by instructor
const getAllCoursesByInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    const instructor = await User.findById(id);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({ message: 'Instructor not found or not valid' });
    }

    const courses = await Course.find({ instructor: instructor._id }).populate('instructor', 'name email');

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// create a course
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      price,
      duration,
      instructorEmail,
    } = req.body;

    console.log(req.body);

    // Basic validation
    if (!title || !description || !category || !price || !duration || !instructorEmail) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const instructorUser = await User.findOne({ email: instructorEmail });
    if (!instructorUser || instructorUser.role !== 'instructor') {
      return res.status(400).json({ message: 'Invalid instructor ID' });
    }

    // Create the course
    const newCourse = new Course({
      title,
      description,
      category,
      level: level || 'Beginner',
      price,
      duration,
      instructor: instructorUser._id, // ✅ Fixed
    });

    const savedCourse = await newCourse.save();


    // Add course to instructor's teachingCourses list
    instructorUser.teachingCourses.push(savedCourse._id);
    console.log('after saved');
    await instructorUser.save();
    console.log('after saved2');

    res.status(200).json({
      success: true,
      message: 'Course created successfully',
      course: savedCourse
    });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete course
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const instructorId = req.params.instructorId;

    console.log(`delete course: ${courseId} & email: ${instructorId}`);

    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this course' });
    }

    // Delete lessons
    await Lesson.deleteMany({ course: courseId });

    // Delete quiz
    await Quiz.deleteMany({ course: courseId });

    // Delete enrollments
    await Enrollment.deleteMany({ course: courseId });

    // Delete certificates
    await Certificate.deleteMany({ course: courseId });

    // Remove course reference from instructor
    await User.updateOne(
      { _id: instructorId },
      { $pull: { teachingCourses: courseId } }
    );

    // Finally delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// update the course
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const instructorId = req.body.id;
    const { title,
      description,
      category,
      level,
      price,
      duration } = req.body;

    const updates = {
      title,
      description,
      category,
      level,
      price,
      duration
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this course' });
    }

    // Update fields
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updates, { new: true });

    res.status(200).json({
      message: 'Course updated successfully',
      course: updatedCourse,
    });

  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCourseDetails,
  getAllCourses,
  getAllCoursesByInstructor,
  createCourse,
  deleteCourse,
  updateCourse,
  deleteCourse
}