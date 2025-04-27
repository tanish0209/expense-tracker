import React from "react";
import card1 from "../../assets/card1.png";
import { LuTrendingUpDown } from "react-icons/lu";
const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        {children}
      </div>
      <div className="hidden md:block border-l border-l-gray-500 w-[40vw] h-screen bg-neutral-900 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-violet-400 absolute -top-7 -left-5" />
        <div className="w-48 h-60 rounded-[40px] border-[16px] border-fuchsia-200 absolute top-[30%] -right-[10%]" />
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute top-[85%] -right-5" />
        <div className="w-48 h-30 rounded-[40px] border-[16px] border-purple-700 absolute top-[50%] -left-[10%]" />
        <div className="w-48 h-70 rounded-[40px] bg-fuchsia-400 absolute top-[75%] -left-5" />

        <div className="grid grid-cols-1 z-20">
          <StatInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="43,000"
          />
        </div>
        <div className="flex justify-center items-center">
          <img
            src={card1}
            className="w-64 2xl:w-[80%] absolute bottom-10 rounded-xl "
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatInfoCard = ({ icon, label, value }) => {
  return (
    <div className="flex gap-6 bg-secondary p-4 rounded-xl border border-gray-700 z-5">
      <div
        className={`w-12 h-12  flex items-center justify-center text-[25px]  text-secondary bg-white rounded-full`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-2xl  font-bold text-primary m-1">{label}</h6>
        <span className="text-[20px] ml-1 text-gray-300">${value}</span>
      </div>
    </div>
  );
};
