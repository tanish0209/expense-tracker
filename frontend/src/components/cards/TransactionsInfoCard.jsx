import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";

const TransactionsInfoCard = ({
  title,
  date,
  icon,
  amount,
  type,
  hideDeleteBtn,
  onDelete,
}) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-800  transition-all duration-300">
      <div className="w-11 h-11 flex items-center justify-center text-lg text-primary bg-gray-700 rounded-full">
        {icon ? (
          <img src={icon} alt={title} className="w-6 h-6" />
        ) : (
          <LuUtensils />
        )}
      </div>
      <div className="flex-1 flex items-center justify-between ">
        <div>
          <p className="text-sm text-primary font-medium">{title}</p>
          <p className="text-xs text-primary mt-1">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          {!hideDeleteBtn && (
            <button
              className="text-primary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded md ${getAmountStyles()}`}
          >
            <h6 className="flex items-center  gap-0.5 md:gap-2 text-xs sm:text-lg font-semibold">
              {type === "income" ? "+" : "-"} ${amount}
              {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsInfoCard;
