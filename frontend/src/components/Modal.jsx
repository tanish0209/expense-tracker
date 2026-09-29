import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-white hover:bg-neutral-800 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)] space-y-4 text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
