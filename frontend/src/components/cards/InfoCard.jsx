import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 items-center bg-white/40 p-2 md:p-6 rounded-xl  ">
      <div
        className={`w-10 h-10 xl:w-11 xl:h-11 flex items-center justify-center text-2xl text-primary ${color} rounded-full`}
      >
        {icon}
      </div>
      <div className=" flex md:block lg:flex items-center gap-10 sm:gap-40 lg:gap-10 xl:gap-45">
        <h6 className="text-lg sm:text-2xl md:text-3xl font-semibold text-primary md:mb-1">
          {label}
        </h6>
        <span className="text-xl sm:text-3xl md:text-5xl font-bold">
          &#8377; {value}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
