import moment from "moment";
import React from "react";
import { LuDownload, LuTrash2 } from "react-icons/lu";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  const expenseList = Array.isArray(transactions)
    ? transactions
    : transactions?.expense || [];

  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-4 md:p-6 shadow-xl text-white backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-700/60 pb-4">
        <h5 className="text-lg md:text-xl font-bold tracking-wide text-gray-100">
          Expense History
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
        <p>Category</p>
        <p className="text-center">Date</p>
        <p className="text-center">Amount</p>
        <p className="text-right">Action</p>
      </div>

      {/* Transactions */}
      <div className="flex flex-col divide-y divide-neutral-700/50 mt-2">
        {expenseList.length === 0 ? (
          <p className="text-center py-8 text-sm text-gray-400">No expense records found.</p>
        ) : (
          expenseList.map((expense) => (
            <div
              key={expense._id}
              className="grid grid-cols-[1fr_1fr_1fr_0.5fr] sm:grid-cols-[5fr_3fr_4fr_1fr] py-3.5 px-4 items-center gap-2 text-xs md:text-sm hover:bg-neutral-700/30 rounded-lg transition-all"
            >
              {/* Expense Category */}
              <div className="flex items-center">
                <TransactionsInfoCard
                  title={expense.category}
                  subtitle={expense.accountId?.name}
                  icon={expense.icon}
                  type="expense"
                  amount={expense.amount}
                  hideDeleteBtn
                  compact
                />
              </div>

              {/* Date */}
              <div className="flex justify-center">
                <p className="font-medium text-xs md:text-sm text-gray-300">
                  {moment(expense.date).format("Do MMM YYYY")}
                </p>
              </div>

              {/* Amount */}
              <div className="flex justify-center">
                <p className="font-bold px-3 py-1 text-xs md:text-sm rounded-lg w-fit bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  - ₹ {Number(expense.amount || 0).toLocaleString()}
                </p>
              </div>

              {/* Delete */}
              <div className="flex justify-end">
                <button
                  onClick={() => onDelete(expense._id)}
                  className="text-gray-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete Expense"
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

export default ExpenseList;
