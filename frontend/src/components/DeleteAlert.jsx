import React from "react";

const DeleteAlert = ({ content, onDelete }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-300 font-medium">{content}?</p>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs md:text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
          onClick={onDelete}
        >
          Confirm Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
