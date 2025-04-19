import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-secondary p-6 rounded-xl border  border-gray-500">
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-primary ${color} rounded-full`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-primary mb-1">{label}</h6>
        <span className="text-[22px]">${value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
