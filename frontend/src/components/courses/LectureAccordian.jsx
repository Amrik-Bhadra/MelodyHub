import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

import pdf from "../../assets/pdf.png";
import doc from "../../assets/doc.png";
import video from "../../assets/video.png";
import quiz from "../../assets/quiz.png";

const LectureAccordian = ({
  lesson,
  setLessons,
  index,
  setSelectedLesson,
  onAdd,
  setSelectedResource,
  setDeleteResourceModal,
}) => {
  const getIcon = (type) => {
    if (type === "pdf") return pdf;
    else if (type === "doc") return doc;
    else if (type === "video") return video;
    else return quiz;
  };
  return (
    <div
      key={lesson._id}
      className="border rounded-lg bg-gray-50 overflow-hidden"
    >
      <div
        onClick={() =>
          setLessons((prev) =>
            prev.map((l, i) => (i === index ? { ...l, open: !l.open } : l))
          )
        }
        className="flex justify-between items-center p-4 bg-white cursor-pointer hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-x-3">
          <span className="h-8 w-8 flex justify-center items-center border border-sky text-sky bg-sky-op rounded-md">
            {lesson.order}
          </span>
          <h3 className="text-md font-medium text-gray-800">{lesson.title}</h3>
        </div>
        <span className="text-xl text-sky transition-transform duration-300">
          {lesson.open ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </span>
      </div>

      {lesson.open && (
        <div className="px-6 pb-5 pt-2 bg-gray-50">
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {lesson.resources.length === 0 ? (
              <li className="text-sm italic text-gray-500">No resources yet</li>
            ) : (
              lesson.resources.map((res, rIdx) => (
                <li
                  key={rIdx}
                  className="flex items-center justify-between gap-2 py-2"
                >
                  <div className="flex items-center gap-x-2">
                    <img src={getIcon(res.type)} alt="" className="h-6" />
                    {res.name}
                  </div>

                  <div className="flex items-center gap-x-3 text-xl text-[#464646] ">
                    <MdDelete
                      className="hover:text-sky"
                      onClick={() => {
                        setSelectedLesson(lesson._id);
                        setDeleteResourceModal(true);
                        setSelectedResource(res);
                      }}
                    />
                    <AiOutlineEdit className="hover:text-sky" />
                  </div>
                </li>
              ))
            )}
          </ul>

          <button
            onClick={() => {
              onAdd();
              setSelectedLesson(lesson._id);
            }}
            className="w-full mt-4 px-3 py-3 font-semibold text-md bg-sky-op text-sky hover:text-white rounded-md hover:bg-sky transition"
          >
            + Add Resource
          </button>
        </div>
      )}
    </div>
  );
};

export default LectureAccordian;
