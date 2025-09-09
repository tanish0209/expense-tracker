import React, { useState } from "react";
import EmojiPickerPop from "../EmojiPickerPop";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });
  const handleChange = (key, value) => setExpense({ ...expense, [key]: value });
  return (
    <div>
      <EmojiPickerPop
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />
      <div className="m-2">
        <label className="text-md text-primary">Expense category</label>
        <input
          value={expense.category}
          className="w-full bg-transparent  border border-gray-300 p-3 mt-2 rounded-2xl"
          onChange={({ target }) => handleChange("category", target.value)}
          placeholder="Freelance,Salary,etc."
          type="text"
        />
      </div>
      <div className="m-2">
        <label className="text-md text-primary">Expense Amount</label>
        <input
          value={expense.amount}
          className="no-spinner w-full bg-transparent  border border-gray-300 p-3 mt-2 rounded-2xl"
          onChange={({ target }) => handleChange("amount", target.value)}
          label="Amount"
          placeholder="eg.5000"
          type="number"
        />
      </div>
      <div className="m-2">
        <label className="text-md text-primary">Expense Date</label>
        <input
          value={expense.date}
          className="w-full bg-transparent  border border-gray-300 p-3 mt-2 rounded-2xl"
          onChange={({ target }) => handleChange("date", target.value)}
          label="Expense Date"
          placeholder=""
          type="date"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(expense)}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
