import React from "react";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import TransactionsInfoCard from "../cards/TransactionsInfoCard";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card text-primary border-gray-400">
      {/* Header */}
      <div className="flex items-center border-b pb-4 justify-between px-6">
        <h5 className="text-lg font-semibold">Expenses</h5>
        <button
          className="card-btn flex items-center gap-1"
          onClick={onSeeMore}
        >
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[5fr_3fr_4fr] py-4 px-6 border-b border-gray-200 text-gray-100 bg-gray-800 rounded-2xl border-none mt-3 text-sm font-semibold">
        <p>Expense Name</p>
        <p className="text-center">Date</p>
        <p className="text-right">Amount</p>
      </div>

      {/* Transactions */}
      <div className="flex flex-col divide-y divide-gray-200">
        {transactions?.slice(0, 5)?.map((expense) => (
          <div
            key={expense.id}
            className="grid grid-cols-[5fr_3fr_4fr] py-5 px-6 items-center"
          >
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
            <p className="text-center font-medium text-xs sm:text-sm md:text-base ">
              {moment(expense.date).format("Do MMM YYYY")}
            </p>
            <p
              className="text-right font-semibold 
                      place-self-end px-3 py-1.5 text-xs sm:text-sm  rounded-md w-fit bg-red-50 text-red-500"
            >
              - &#8377; {expense.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
