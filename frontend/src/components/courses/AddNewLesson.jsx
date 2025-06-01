import { useState } from "react";
import useAxios from "../../utils/validator/useAxios";
import toast from "react-hot-toast";
import { IoAdd } from "react-icons/io5";
import InputFieldComponent from "../form_components/InputFieldComponent";

const AddNewLesson = ({ courseId, onClose, fetchCourseData }) => {
  const [order, setOrder] = useState(0);
  const [title, setTitle] = useState("");
  const axiosInstance = useAxios();

  const authString = localStorage.getItem("auth");
  const auth = authString ? JSON.parse(authString) : null;
  const id = auth.user._id;

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/api/lessons/create/${courseId}`, {
        order,
        title,
        instructorId: id
      });
      if (response.status == 200) {
        toast.success(response.data.message);
        setOrder(0);
        setTitle("");
        fetchCourseData();
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-xl relative">
        <span className="flex gap-x-2 items-center mb-6">
          <div className="p-2 rounded-full bg-sky bg-opacity-[30%] border border-sky">
            <IoAdd className="text-sky text-2xl font-semibold" />
          </div>
          <h2 className="text-2xl font-medium text-left">New Lesson</h2>
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
            label="Lesson Number"
            type="number"
            name="order"
            placeholder="Enter Lesson Number"
            value={order}
            onChange={setOrder}
            required
          />

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
              Add Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewLesson;
