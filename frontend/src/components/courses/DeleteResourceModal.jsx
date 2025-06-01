import { IoWarningOutline } from "react-icons/io5";
const DeleteResourceModal = ({ onClose, onConfirm, resourceName }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-x-2">
            <IoWarningOutline className="text-red-600 text-2xl"/> <p>Confirm Deletion</p>
          </h2>
          <p className="text-sm text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-bold">{resourceName}</span> Course? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteResourceModal;