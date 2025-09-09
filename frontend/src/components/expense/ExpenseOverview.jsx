import React from "react";
import { LuPlus } from "react-icons/lu";
import LineChartFromExpense from "./LineChartFromExpense";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  return (
    <div className="card w-full text-primary">
      <div className="flex items-center justify-between">
        <h5 className="md:text-3xl font-bold">Expense Overview Section</h5>
        <button className="add-btn" onClick={onAddExpense}>
          <LuPlus className="md:text-lg" />
          <p className="text-[9px] md:text-lg">Add Expense</p>
        </button>
      </div>
      <div className="mt-2 md:mt-10">
        <LineChartFromExpense transactions={transactions.expense} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
