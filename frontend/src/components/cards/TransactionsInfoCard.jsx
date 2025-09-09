import React from "react";
import { LuUtensils, LuTrash2 } from "react-icons/lu";

const TransactionsInfoCard = ({
  title,
  icon,
  type,
  amount,
  hideDeleteBtn,
  onDelete,
  compact,
}) => {
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div
      className={`group relative flex items-center gap-1 md:gap-4 ${
        compact
          ? ""
          : "mt-2 p-3 rounded-lg hover:bg-gray-800 transition-all duration-300"
      }`}
    >
      <div className="hidden md:flex w-10 h-10 items-center justify-center text-lg text-primary bg-gray-700 rounded-full">
        {icon ? (
          <img src={icon} alt={title} className=" w-6 h-6 object-contain" />
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs md:text-sm text-primary font-medium">{title}</p>
      </div>

      {/* Delete button always visible */}
      <div className="flex items-center md:gap-2">
        {!hideDeleteBtn && (
          <button
            className="text-red-500 hover:text-red-600 transition-all duration-300 cursor-pointer"
            onClick={onDelete}
          >
            <LuTrash2 size={18} />
          </button>
        )}
        {/* Amount only visible if not compact */}
        {!compact && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
          >
            <h6 className="flex items-center gap-1 text-xs sm:text-base md:text-lg font-semibold">
              {type === "income" ? "+" : "-"} &#8377; {amount}
            </h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsInfoCard;
