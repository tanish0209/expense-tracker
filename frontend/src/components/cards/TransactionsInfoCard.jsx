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
    type === "income"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : "bg-rose-500/10 text-rose-400 border border-rose-500/20";

  return (
    <div
      className={`group relative flex items-center gap-1 md:gap-4 ${
        compact
          ? ""
          : "mt-2 p-3 rounded-xl hover:bg-neutral-700/40 transition-all duration-200"
      }`}
    >
      <div className="hidden md:flex w-9 h-9 items-center justify-center text-sm text-gray-200 bg-neutral-700/80 rounded-full shrink-0">
        {icon ? (
          <img src={icon} alt={title} className="w-5 h-5 object-contain" />
        ) : (
          <LuUtensils />
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs md:text-sm text-gray-200 font-medium">{title}</p>
      </div>

      {/* Delete button always visible */}
      <div className="flex items-center md:gap-2">
        {!hideDeleteBtn && (
          <button
            className="text-gray-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
            onClick={onDelete}
          >
            <LuTrash2 size={16} />
          </button>
        )}
        {/* Amount only visible if not compact */}
        {!compact && (
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg ${getAmountStyles()}`}
          >
            <h6 className="flex items-center gap-1 text-xs sm:text-sm font-semibold">
              {type === "income" ? "+" : "-"} ₹ {Number(amount || 0).toLocaleString()}
            </h6>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsInfoCard;
