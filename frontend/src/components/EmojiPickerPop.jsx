import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";
const EmojiPickerPop = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-10 h-10 flex items-center justify-center text-2xl bg-secondary text-primary rounded-lg">
          {icon ? (
            <img src={icon} alt="Icon" className="w-8 h-8" />
          ) : (
            <LuImage />
          )}
        </div>
        <p className=""> {icon ? "Change Icon" : "Pick Icon"}</p>
      </div>
      {isOpen && (
        <div className="relative">
          <button
            className="w-6 h-6 flex items-center justify-center bg-secondary border border-gray-200 rounded-full -top-2 -right-2 absolute  z-10 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <LuX />
          </button>
          <EmojiPicker
            open={isOpen}
            className="bg-secondary text-primary"
            onEmojiClick={(emoji) => onSelect(emoji?.imageUrl || "")}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPop;
