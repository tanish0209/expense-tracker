import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-white/40 bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Model Content */}
        <div className="relative bg-gray-900 rounded-lg ">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-500">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              type="button"
              className="bg-transparent rounded-xl font-bold border text-sm w-8 h-8 inline-flex justify-center items-center hover:bg-white hover:text-gray-900 cursor-pointer transition-all duration-300"
              onClick={onClose}
            >
              X
            </button>
          </div>
          {/* Modal Body */}
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
