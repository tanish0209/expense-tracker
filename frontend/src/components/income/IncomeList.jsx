import moment from "moment";
import React from "react";
import { LuDownload, LuTrash2 } from "react-icons/lu";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  const incomeList = Array.isArray(transactions)
    ? transactions
    : transactions?.income || [];

  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-4 md:p-6 shadow-xl text-white backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-700/60 pb-4">
        <h5 className="text-lg md:text-xl font-bold tracking-wide text-gray-100">
          Income History
        </h5>
        <button
          className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-gray-200 text-xs md:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
          onClick={onDownload}
        >
          <LuDownload className="text-base" /> Download Excel
        </button>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[5fr_3fr_4fr_1fr] py-3 px-4 border-b border-neutral-700 text-gray-400 bg-neutral-900/60 rounded-xl mt-4 text-xs font-semibold uppercase tracking-wider">
        <p>Source</p>
        <p className="text-center">Date</p>
        <p className="text-center">Amount</p>
        <p className="text-right">Action</p>
      </div>

      {/* Transactions */}
      <div className="flex flex-col divide-y divide-neutral-700/50 mt-2">
        {incomeList.length === 0 ? (
          <p className="text-center py-8 text-sm text-gray-400">No income records found.</p>
        ) : (
          incomeList.map((income) => (
            <div
              key={income._id}
              className="grid grid-cols-[1fr_1fr_1fr_0.5fr] sm:grid-cols-[5fr_3fr_4fr_1fr] py-3.5 px-4 items-center gap-2 text-xs md:text-sm hover:bg-neutral-700/30 rounded-lg transition-all"
            >
              {/* Income Name */}
              <div className="flex items-center">
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
                <p className="font-medium text-xs md:text-sm text-gray-300">
                  {moment(income.date).format("Do MMM YYYY")}
                </p>
              </div>

              {/* Amount */}
              <div className="flex justify-center">
                <p className="font-bold px-3 py-1 text-xs md:text-sm rounded-lg w-fit bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  + ₹ {Number(income.amount || 0).toLocaleString()}
                </p>
              </div>

              {/* Delete */}
              <div className="flex justify-end">
                <button
                  onClick={() => onDelete(income._id)}
                  className="text-gray-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Income"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncomeList;
