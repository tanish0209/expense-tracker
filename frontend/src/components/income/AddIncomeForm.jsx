import React, { useState } from "react";
import EmojiPickerPop from "../EmojiPickerPop";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });
  const handleChange = (key, value) => setIncome({ ...income, [key]: value });

  return (
    <div className="space-y-4">
      <EmojiPickerPop
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Income Source
        </label>
        <input
          value={income.source}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-neutral-500"
          onChange={({ target }) => handleChange("source", target.value)}
          placeholder="e.g. Freelance, Salary, Investments"
          type="text"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Income Amount (₹)
        </label>
        <input
          value={income.amount}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-neutral-500"
          onChange={({ target }) => handleChange("amount", target.value)}
          placeholder="e.g. 5000"
          type="number"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1">
          Income Date
        </label>
        <input
          value={income.date}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white px-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          onChange={({ target }) => handleChange("date", target.value)}
          type="date"
          required
        />
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          onClick={() => onAddIncome(income)}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
