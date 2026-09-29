import React from "react";
import card1 from "../../assets/card1.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <div className="w-full md:w-[55vw] lg:w-[50vw] px-6 sm:px-10 md:px-14 pt-24 pb-12 flex flex-col justify-center mx-auto">
        {children}
      </div>
      <div className="hidden md:block border-l border-neutral-800 w-[45vw] lg:w-[50vw] min-h-screen bg-neutral-950 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-40 h-40 rounded-[30px] bg-violet-600/30 blur-xl absolute -top-5 -left-5" />
        <div className="w-40 h-52 rounded-[30px] border-[12px] border-fuchsia-500/20 absolute top-[30%] -right-[5%]" />
        <div className="w-40 h-40 rounded-[30px] bg-purple-600/30 blur-xl absolute top-[85%] -right-5" />
        <div className="w-40 h-28 rounded-[30px] border-[12px] border-purple-500/20 absolute top-[50%] -left-[5%]" />

        <div className="grid grid-cols-1 z-20 max-w-sm mt-16">
          <StatInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="43,000"
          />
        </div>
        <div className="flex justify-center items-center">
          <img
            src={card1}
            className="w-56 lg:w-72 absolute bottom-12 rounded-xl shadow-2xl border border-white/10"
            alt="Dashboard preview"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const StatInfoCard = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-4 bg-neutral-900/90 backdrop-blur-md p-4 rounded-xl border border-neutral-800 shadow-lg z-10">
      <div className="w-10 h-10 flex items-center justify-center text-xl text-indigo-400 bg-indigo-500/10 rounded-lg shrink-0">
        {icon}
      </div>
      <div>
        <h6 className="text-sm font-semibold text-gray-200">{label}</h6>
        <span className="text-base font-bold text-indigo-400">${value}</span>
      </div>
    </div>
  );
};
