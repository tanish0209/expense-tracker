import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-4 items-center bg-black/20 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
      <div
        className={`w-10 h-10 flex items-center justify-center text-lg text-white ${color} rounded-xl shrink-0 shadow-md`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <h6 className="text-xs font-semibold text-gray-200 tracking-wide">
          {label}
        </h6>
        <span className="text-base md:text-lg font-bold text-white">
          ₹ {Number(value || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
