import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAxios from "../../utils/validator/useAxios";
import wallpaper from "../../assets/music_wallpaper.jpg";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import LectureAccordian from "../../components/courses/LectureAccordian";
import nodata from "../../assets/nodata.svg";
import AddNewLesson from "../../components/courses/AddNewLesson";
import AddNewResource from "../../components/courses/AddNewResource";

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  // const [lessons, setLessons] = useState([
  //   {
  //     id: 1,
  //     title: "Introduction to Classical Music",
  //     resources: [
  //       { name: "Lecture 1", type: "video" },
  //       { name: "Lecture 1 Notes", type: "pdf" },
  //       { name: "Lecture 2", type: "video" },
  //       { name: "Practice Sheet", type: "doc" },
  //     ],
  //     open: false,
  //   },
  //   {
  //     id: 2,
  //     title: "Understanding Rhythm",
  //     resources: [
  //       { name: "Lecture 1", type: "video" },
  //       { name: "Practice Sheet", type: "doc" },
  //     ],
  //     open: false,
  //   },
  //   {
  //     id: 3,
  //     title: "Melody and Harmony",
  //     resources: [
  //       { name: "Lecture 1", type: "video" },
  //       { name: "Practice Sheet", type: "doc" },
  //     ],
  //     open: false,
  //   },
  // ]);
  const [lessons, setLessons] = useState([]);
  const [isAddNewLesson, setIsAddNewLesson] = useState(false);
  const [isAddNewResource, setIsAddNewResource] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState("");

  const getDuration = (duration) => {
    const decimal = duration / 60 - Math.floor(duration / 60);
    if (decimal > 0) {
      return (duration / 60).toFixed(2);
    } else {
      return Math.floor(duration / 60);
    }
  };

  const fetchCourseData = async () => {
    try {
      const response = await axiosInstance.get(`/api/courses/${id}`);
      if (response.status === 200) {
        console.log();
        setCourse(response.data.course);
        setLessons(response.data.lessons);
      } else {
        toast.error("Course not found!");
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);
  return (
    <div className="w-full flex gap-x-2">
      <div
        id="left-container"
        className="w-[40%] bg-white shadow-sm border rounded-md p-3 h-fit"
      >
        <div
          id="image-div"
          className="w-full rounded-md overflow-clip relative"
        >
          <img src={wallpaper} alt="" />

          <div
            onClick={() => {
              navigate("/instructor/courses");
            }}
            className="p-2 bg-white rounded-full absolute top-2 left-2 text-xl cursor-pointer"
          >
            <IoChevronBackOutline />
          </div>
        </div>

        <div id="contentdiv" className="p-4 flex flex-col gap-y-3">
          <h2 className="text-xl font-semibold text-gray-800">
            {course.title}
          </h2>
          <p className="text-sm text-gray-600">{course.description}</p>
          <div className="flex items-center gap-x-3">
            <span className="text-sm px-2 py-1 rounded-md text-sky bg-sky-op border border-sky">
              {course.category}
            </span>
            <span className="text-sm px-2 py-1 rounded-md text-sky bg-sky-op border border-sky">
              {course.level}
            </span>
            <span className="text-sm px-2 py-1 rounded-md text-sky bg-sky-op border border-sky">
              {getDuration(Number(course.duration))} hrs
            </span>
          </div>

          <div className="flex items-center justify-between mt-3">
            <h3 className="text-xl font-semibold text-gray-800">
              Rs. {course.price}
            </h3>
          </div>
        </div>
      </div>
      <div
        id="right-container"
        className="w-[60%] bg-white shadow-sm border rounded-md p-5"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-primary-txt">
            Course Lessons
          </h2>
          <button
            onClick={() => {
              setIsAddNewLesson(true);
            }}
            className="flex items-center gap-x-2 px-3 py-2 font-semibold bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <IoMdAdd className="font-semibold text-xl" />
            Add Lesson
          </button>
        </div>

        {lessons.length == 0 ? (
          <div className="py-4 items-center justify-center flex flex-col">
            <img src={nodata} alt="" className="h-[15rem]" />
            <h1 className="text-md font-semibold text-[#464646]">
              No Lessons Added Yet
            </h1>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <LectureAccordian
                key={index}
                lesson={lesson}
                setLessons={setLessons}
                index={index}
                setSelectedLesson={setSelectedLesson}
                onAdd={() => setIsAddNewResource(true)}
              />
            ))}
          </div>
        )}
      </div>

      {isAddNewLesson && (
        <AddNewLesson
          courseId={id}
          lessonId={selectedLesson}
          onClose={() => setIsAddNewLesson(false)}
          fetchCourseData={fetchCourseData}
        />
      )}

      {isAddNewResource && (
        <AddNewResource
          lessonId={selectedLesson}
          onClose={() => setIsAddNewResource(false)}
          fetchCourseData={fetchCourseData}
        />
      )}
    </div>
  );
};

export default InstructorCourseDetail;
