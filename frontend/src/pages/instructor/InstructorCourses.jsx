import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddNewCours from "../../components/courses/AddNewCourse";
import DeleteProjectModal from "../../components/courses/DeleteCourseModal";
import toast from "react-hot-toast";

import useAxios from "../../utils/validator/useAxios";

// const initialCourses = [
//   {
//     _id: "1",
//     title: "Beginner Guitar Lessons",
//     description: "Learn chords, strumming, and basic melodies.",
//     category: "Instrumental",
//     level: "Beginner",
//     price: 499,
//     duration: 60,
//     isPublished: true,
//   },
//   {
//     _id: "2",
//     title: "Intermediate Piano",
//     description: "Explore scales, sight-reading, and harmony.",
//     category: "Instrumental",
//     level: "Intermediate",
//     price: 799,
//     duration: 75,
//     isPublished: false,
//   },
//   {
//     _id: "3",
//     title: "Music Theory Basics",
//     description: "Fundamentals of music theory for all musicians.",
//     category: "Theory",
//     level: "Beginner",
//     price: 299,
//     duration: 45,
//     isPublished: true,
//   },
// ];

const InstructorCourses = () => {
  const authString = localStorage.getItem("auth");
  const auth = authString ? JSON.parse(authString) : null;
  const axiosInstance = useAxios();
  // const navigate = useNavigate();

  // State for course pending deletion
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  // const [isEditCourseModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  // const handleEditCourse = (courseId) => {
  //   // Navigate to edit course page with courseId
  //   navigate(`/instructor/courses/edit/${courseId}`);
  // };

  const fetchCourses = async () => {
    try {
      const email = auth.user.email;
      const response = await axiosInstance.get(`/api/courses/instructor`, {
        params: { email },
      });

      if (response.status === 200) {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.log("Fetch courses error: ", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.delete(
        `/admin/deleteProject/${courseToDelete}`
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Project Deleted Successfully!");
        await fetchCourses();
      } else {
        toast.error(response.data.message || "Failed To Delete Project");
      }
    } catch (error) {
      toast.error("Error deleting employee");
      console.error("Delete Error:", error);
    }

    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  // Show confirmation card/modal for deletion
  const confirmDeleteCourse = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    if (course) setCourseToDelete(course);
  };

  return (
    <div className="p-4 space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">My Courses</h2>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          onClick={() => setAddCourseModalOpen(true)}
        >
          + Add Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length == 0 && <div>No courses yet</div>}

        {courses.length > 0 && (
          <>
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {course.description}
                  </p>

                  <div className="mt-2 text-sm text-gray-700">
                    <strong>Category:</strong> {course.category}
                  </div>

                  <div className="mt-1 text-sm text-gray-700">
                    <strong>Level:</strong> {course.level}
                  </div>

                  <div className="mt-1 text-sm text-gray-700">
                    <strong>Duration:</strong> {course.duration} minutes
                  </div>

                  <p className="text-sm font-medium mt-4 text-blue-600">
                    ₹{course.price}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                      course.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-md"
                    onClick={() => handleEditCourse(course._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                    onClick={() => confirmDeleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Confirmation Card (Modal) */}
      {isDeleteCourseModalOpen && (
        // <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        //   <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        //     <h3 className="text-lg font-semibold mb-4 text-gray-800">
        //       Delete Course
        //     </h3>
        //     <p className="mb-6 text-gray-700">
        //       Are you sure you want to delete <strong>{courseToDelete.title}</strong>?
        //     </p>
        //     <div className="flex justify-end gap-4">
        //       <button
        //         className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        //         onClick={handleDeleteCancelled}
        //       >
        //         Cancel
        //       </button>
        //       <button
        //         className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        //         onClick={handleDeleteConfirmed}
        //       >
        //         Delete
        //       </button>
        //     </div>
        //   </div>
        // </div>

        <DeleteProjectModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {isAddCourseModalOpen && (
        <AddNewCours
          onClose={() => {
            setAddCourseModalOpen(false);
          }}
          fetchCourses={fetchCourses}
        />
      )}
    </div>
  );
};

export default InstructorCourses;
