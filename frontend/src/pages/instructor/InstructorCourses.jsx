import React, { useEffect, useState } from "react";
import AddNewCours from "../../components/courses/AddNewCourse";
import DeleteProjectModal from "../../components/courses/DeleteCourseModal";
import toast from "react-hot-toast";

import useAxios from "../../utils/validator/useAxios";
import CourseCard from "../../components/courses/CourseCard";
import EditCourse from "../../components/courses/EditCourse";

const InstructorCourses = () => {
  const authString = localStorage.getItem("auth");
  const auth = authString ? JSON.parse(authString) : null;
  const axiosInstance = useAxios();
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  // const [isEditCourseModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteCourseModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  const id = auth.user._id;

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get(`/api/courses/instructor/${id}`);

      if (response.status === 200) {
        setCourses(response.data.courses);
        setCourseCount(response.data.count);
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
        `api/courses/delete/${courseToDelete._id}/${id}`
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

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-4 space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          My Courses ({courseCount})
        </h2>
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
              <CourseCard
                key={course._id}
                course={course}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setCourseToDelete={setCourseToDelete}
                setIsEditModalOpen={setIsEditModalOpen}
                setEditCourse={setEditCourse}
              />
            ))}
          </>
        )}
      </div>

      {/* Confirmation Card (Modal) */}
      {isDeleteCourseModalOpen && (
        <DeleteProjectModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          courseName={courseToDelete?.title}
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

      {isEditModalOpen && (
        <EditCourse
          onClose={() => setIsEditModalOpen(false)}
          fetchCourses={fetchCourses}
          course={editCourse}
        />
      )}
    </div>
  );
};

export default InstructorCourses;
