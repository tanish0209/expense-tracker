import React from "react";
import { LuPlus } from "react-icons/lu";
import LineChartFromExpense from "./LineChartFromExpense";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  return (
    <div className="card w-full text-primary">
      <div className="flex items-center justify-between">
        <h5 className="text-3xl font-bold">Expense Overview Section</h5>
        <button className="add-btn" onClick={onAddExpense}>
          <LuPlus className="text-lg" />
          Add Expense
        </button>
      </div>
      <div className="mt-10">
        <LineChartFromExpense transactions={transactions.expense} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
