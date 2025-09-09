import moment from "moment";
import React from "react";
import { LuDownload, LuTrash2 } from "react-icons/lu";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card text-primary border-gray-400">
      {/* Header */}
      <div className="flex items-center border-b pb-4 justify-between px-6">
        <h5 className="text-lg font-semibold">Income</h5>
        <button
          className="card-btn flex items-center gap-2"
          onClick={onDownload}
        >
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[5fr_3fr_4fr_1fr] py-4 px-6 border-b border-gray-200 text-gray-100 bg-gray-800 rounded-2xl border-none mt-3 text-cs md:text-sm font-semibold">
        <p>Income Name</p>
        <p className="text-center">Date</p>
        <p className="text-center">Amount</p>
        <p className="text-right">Delete</p>
      </div>

      {/* Transactions */}
      <div className="flex flex-col divide-y divide-gray-200">
        {transactions.income?.map((income) => (
          <div
            key={income._id}
            className="grid grid-cols-[1fr_1fr_2fr_0.5fr] sm:grid-cols-[5fr_3fr_4fr_1fr] py-5 px-6 items-center gap-1 md:gap-4 text-xs md:text-sm hover:bg-gray-800/40 transition-all duration-300 "
          >
            {/* Income Name */}
            <div className="flex items-center md:gap-3">
              <TransactionsInfoCard
                title={income.source}
                icon={income.icon}
                type="income"
                amount={income.amount}
                hideDeleteBtn
                compact
              />
            </div>

            {/* Date */}
            <div className="flex justify-center">
              <p className="font-medium text-xs sm:text-sm md:text-base">
                {moment(income.date).format("Do MMM YYYY")}
              </p>
            </div>

            {/* Amount */}
            <div className="flex justify-center">
              <p className="font-semibold px-3 py-1.5 text-xs sm:text-sm rounded-md w-fit bg-green-50 text-green-500">
                + &#8377; {income.amount}
              </p>
            </div>

            {/* Delete */}
            <div className="flex justify-end">
              <button
                onClick={() => onDelete(income._id)}
                className="text-red-500 hover:text-red-600 transition-all duration-300"
              >
                <LuTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
