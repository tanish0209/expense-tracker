import moment from "moment";
import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expense Sources</h5>
        <button className="card-btn" onClick={onDownload}>
          {" "}
          <LuDownload className="text-base" /> Download
        </button>
      </div>
      <div className="grid grid-cols-1 ">
        {transactions.expense?.map((item) => (
          <TransactionsInfoCard
            key={item.id}
            title={item.category}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type="expense"
            onDelete={() => onDelete(item._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
