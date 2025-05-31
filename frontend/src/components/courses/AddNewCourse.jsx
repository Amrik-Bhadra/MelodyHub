import { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import useAxios from "../../utils/validator/useAxios";
import toast from "react-hot-toast";
import InputFieldComponent from "../form_components/InputFieldComponent";
import DropdownComponent from "../form_components/DropdownComponent";

const categoryOpt = [
  { value: "Classical Music", label: "Classical Music" },
  { value: "Folk & Traditional Music", label: "Folk & Traditional Music" },
  { value: "Popular Music", label: "Popular Music" },
  { value: "Instrumental Music", label: "Instrumental Music" },
  {
    value: "Religious & Spiritual Music",
    label: "Religious & Spiritual Music",
  },
  { value: "Film & Theatre Music", label: "Film & Theatre Music" },
];

const levelOpt = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const AddNewCourse = ({ onClose, fetchCourses }) => {
  const authString = localStorage.getItem("auth");
  const auth = authString ? JSON.parse(authString) : null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const axiosInstance = useAxios();

  useEffect(() => {
    fetchCourses();
  }, []);

  const validateFields = () => {
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";
    if (!category) return "Please select a category.";
    if (!level) return "Please select a difficulty level.";
    if (!price || isNaN(price) || Number(price) < 0)
      return "Enter a valid price.";
    if (!duration || isNaN(duration) || Number(duration) <= 0)
      return "Enter a valid duration.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateFields();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const instructorEmail = auth?.user?.email;
      console.log("Instructor email: ", instructorEmail);
      const response = await axiosInstance.post("/api/courses/create", {
        title,
        description,
        category,
        level,
        price: Number(price),
        duration: Number(duration),
        instructorEmail,
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Course created successfully!");
        fetchCourses();
        onClose();
      } else {
        toast.error("Error creating course");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-xl relative">
        <span className="flex gap-x-2 items-center mb-6">
          <div className="p-2 rounded-full bg-sky bg-opacity-[30%] border border-sky">
            <IoAdd className="text-sky text-2xl font-semibold" />
          </div>
          <h2 className="text-2xl font-medium text-left">New Course</h2>
        </span>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <InputFieldComponent
            label="Title"
            type="text"
            name="title"
            placeholder="Enter Title"
            value={title}
            onChange={setTitle}
            required
          />

          <InputFieldComponent
            label="Description"
            type="text"
            name="description"
            placeholder="Enter Description"
            value={description}
            onChange={setDescription}
            required
          />

          <div className="w-full grid grid-cols-2 gap-2">
            <DropdownComponent
              label="Category"
              name="category"
              options={categoryOpt}
              selectedValue={category}
              onChange={setCategory}
              required
              placeholder="Choose a Category"
            />

            <DropdownComponent
              label="Difficulty Level"
              name="level"
              options={levelOpt}
              selectedValue={level}
              onChange={setLevel}
              required
              placeholder="Choose Level"
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <InputFieldComponent
              label="Price (in Rs.)"
              type="number"
              name="price"
              placeholder="Enter Price"
              value={price}
              onChange={setPrice}
              required
            />

            <InputFieldComponent
              label="Duration (in minutes)"
              type="number"
              name="duration"
              placeholder="Enter Duration"
              value={duration}
              onChange={setDuration}
              required
            />
          </div>

          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#f1f1f1] shadow-sm rounded-md"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky text-white rounded-md"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCourse;
