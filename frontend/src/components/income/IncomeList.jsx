import moment from "moment";
import React from "react";
import { LuDownload } from "react-icons/lu";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>
        <button className="card-btn" onClick={onDownload}>
          {" "}
          <LuDownload className="text-base" /> Download
        </button>
      </div>
      <div className="grid grid-cols-1 ">
        {transactions.income?.map((item) => (
          <TransactionsInfoCard
            key={item.id}
            title={item.source}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type="income"
            onDelete={() => onDelete(item._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
