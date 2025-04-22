import React from "react";
import LineChartFromIncome from "./LineChartFromIncome";
import { LuPlus } from "react-icons/lu";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  return (
    <div className="card w-full text-primary">
      <div className="flex items-center justify-between">
        <h5 className="md:text-3xl font-bold">Income Overview Section</h5>
        <button className="add-btn text-sm" onClick={onAddIncome}>
          <LuPlus className="md:text-lg" />
          Add Income
        </button>
      </div>
      <div className="mt-2 md:mt-10">
        <LineChartFromIncome transactions={transactions.income} />
      </div>
    </div>
  );
};

export default IncomeOverview;
