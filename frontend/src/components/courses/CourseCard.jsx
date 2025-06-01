import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import course_wallpaper from "../../assets/music_wallpaper.jpg";

const CourseCard = ({
  course,
  setIsDeleteModalOpen,
  setCourseToDelete,
  setIsEditModalOpen,
  setEditCourse,
}) => {
  const navigate = useNavigate();
  const getDuration = (duration) => {
    const decimal = duration / 60 - Math.floor(duration / 60);
    if (decimal > 0) {
      return (duration / 60).toFixed(2);
    } else {
      return Math.floor(duration / 60);
    }
  };
  return (
    <div
      onClick={() => {
        navigate(`/instructor/courses/${course._id}`);
      }}
      key={course._id}
      className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col justify-between overflow-clip cursor-pointer"
    >
      <div id="imagediv" className="h-36 w-full bg-gray-100">
        <img
          src={course_wallpaper}
          alt={"music_image"}
          className="w-full h-full object-cover overflow-clip"
        />
      </div>
      <div id="contentdiv" className="p-4 flex flex-col gap-y-3">
        <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
        <p className="text-sm text-gray-600">{course.description}</p>
        <div className="flex items-center gap-x-3">
          <span className="text-sm px-2 py-1 rounded-md text-sky bg-sky-op border border-sky">
            {course.category}
          </span>
          <span className="text-sm px-2 py-1 rounded-md text-sky bg-sky-op border border-sky">
            {course.level}
          </span>
          <span className="text-sm px-2 py-1 rounded-md text-sky bg-sky-op border border-sky">
            {getDuration(course.duration)} hrs
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <h3 className="text-xl font-semibold text-gray-800">
            Rs. {course.price}
          </h3>
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => {
                setIsEditModalOpen(true);
                setEditCourse(course);
              }}
              className="bg-[#eee] text-xl text-primary-txt p-3 rounded-full"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => {
                setIsDeleteModalOpen(true);
                setCourseToDelete(course);
              }}
              className="bg-[#eee] text-xl text-primary-txt p-3 rounded-full"
            >
              <MdDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
