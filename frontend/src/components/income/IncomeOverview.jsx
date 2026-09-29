import React from "react";
import LineChartFromIncome from "./LineChartFromIncome";
import { LuPlus } from "react-icons/lu";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const incomeList = Array.isArray(transactions)
    ? transactions
    : transactions?.income || [];

  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl text-white backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-neutral-700/60 pb-4">
        <h5 className="text-lg md:text-xl font-bold tracking-wide text-gray-100">
          Income Overview
        </h5>
        <button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
          onClick={onAddIncome}
        >
          <LuPlus className="text-base" />
          <span>Add Income</span>
        </button>
      </div>
      <div className="mt-4">
        <LineChartFromIncome transactions={incomeList} />
      </div>
    </div>
  );
};

export default IncomeOverview;
