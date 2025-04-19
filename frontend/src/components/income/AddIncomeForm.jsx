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
    <div>
      <EmojiPickerPop
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <div className="m-2">
        <label className="text-md text-primary">Income Source</label>
        <input
          value={income.source}
          className="w-full bg-transparent  border border-gray-300 p-3 mt-2 rounded-2xl"
          onChange={({ target }) => handleChange("source", target.value)}
          placeholder="Freelance,Salary,etc."
          type="text"
        />
      </div>
      <div className="m-2">
        <label className="text-md text-primary">Income Amount</label>
        <input
          value={income.amount}
          className="no-spinner w-full bg-transparent  border border-gray-300 p-3 mt-2 rounded-2xl"
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Amount"
          placeholder="eg.5000"
          type="number"
        />
      </div>
      <div className="m-2">
        <label className="text-md text-primary">Income Date</label>
        <input
          value={income.date}
          className="w-full bg-transparent  border border-gray-300 p-3 mt-2 rounded-2xl"
          onChange={({ target }) => handleChange("date", target.value)}
          label="Income Date"
          placeholder=""
          type="date"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddIncome(income)}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
