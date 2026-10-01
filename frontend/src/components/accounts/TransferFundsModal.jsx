import React, { useState } from "react";
import Modal from "../Modal";

const TransferFundsModal = ({ isOpen, onClose, accounts = [], onTransfer }) => {
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onTransfer({ fromAccountId, toAccountId, amount, date, note });
    setAmount("");
    setNote("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer Funds Between Accounts">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Transfer From (Source Account) *
          </label>
          <select
            required
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
          >
            <option value="" className="bg-neutral-900">Select Source Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id} className="bg-neutral-900">
                {acc.name} (Balance: ₹{Number(acc.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Transfer To (Destination Account) *
          </label>
          <select
            required
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
          >
            <option value="" className="bg-neutral-900">Select Destination Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id} className="bg-neutral-900">
                {acc.name} (Balance: ₹{Number(acc.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="0.00"
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Transfer Date
            </label>
            <input
              type="date"
              required
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Note / Reference (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Credit card bill payment, Savings transfer"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md"
          >
            Execute Transfer
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferFundsModal;
