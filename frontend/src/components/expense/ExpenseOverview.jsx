import React from "react";
import { LuPlus } from "react-icons/lu";
import LineChartFromExpense from "./LineChartFromExpense";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const expenseList = Array.isArray(transactions)
    ? transactions
    : transactions?.expense || [];

  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-4 md:p-6 shadow-xl text-white backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-neutral-700/60 pb-4">
        <h5 className="text-lg md:text-xl font-bold tracking-wide text-gray-100">
          Expense Overview
        </h5>
        <button
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
          onClick={onAddExpense}
        >
          <LuPlus className="text-base" />
          <span>Add Expense</span>
        </button>
      </div>
      <div className="mt-4">
        <LineChartFromExpense transactions={expenseList} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
