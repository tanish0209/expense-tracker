import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  const expenseList = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-3 sm:p-4 md:p-6 shadow-xl backdrop-blur-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-700/60 pb-4">
        <h5 className="text-base md:text-lg font-bold tracking-wide text-gray-100">Expenses</h5>
        <button
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 bg-neutral-700 hover:bg-neutral-600 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          onClick={onSeeMore}
        >
          See All <LuArrowRight className="text-sm" />
        </button>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[5fr_3fr_4fr] py-3 px-4 border-b border-neutral-700 text-gray-400 bg-neutral-900/60 rounded-xl mt-3 text-xs font-semibold uppercase tracking-wider">
        <p>Category</p>
        <p className="text-center">Date</p>
        <p className="text-right">Amount</p>
      </div>

      {/* Transactions */}
      <div className="flex flex-col divide-y divide-neutral-700/50 mt-1">
        {expenseList.length === 0 ? (
          <p className="text-center py-6 text-xs text-gray-400">No expenses recorded yet.</p>
        ) : (
          expenseList.slice(0, 5).map((expense, index) => (
            <div
              key={expense._id || expense.id || index}
              className="py-2.5 sm:py-3 px-2 sm:px-4 hover:bg-neutral-700/30 rounded-lg transition-all"
            >
              {/* Mobile View */}
              <div className="flex sm:hidden items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <TransactionsInfoCard
                    title={expense.category}
                    icon={expense.icon}
                    type="expense"
                    amount={expense.amount}
                    hideDeleteBtn
                    compact
                  />
                  <p className="text-[11px] text-gray-400 font-medium pl-1">
                    {moment(expense.date).format("Do MMM YYYY")}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold px-2.5 py-1 text-xs rounded-lg whitespace-nowrap bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    - ₹ {Number(expense.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden sm:grid sm:grid-cols-[5fr_3fr_4fr] items-center gap-4">
                <div className="flex items-center gap-3">
                  <TransactionsInfoCard
                    title={expense.category}
                    icon={expense.icon}
                    type="expense"
                    amount={expense.amount}
                    hideDeleteBtn
                    compact
                  />
                </div>
                <p className="text-center font-medium text-xs md:text-sm text-gray-300">
                  {moment(expense.date).format("Do MMM YYYY")}
                </p>
                <div className="flex justify-end">
                  <p className="font-semibold px-3 py-1 text-xs rounded-lg w-fit bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    - ₹ {Number(expense.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
