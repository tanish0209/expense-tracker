import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import API from "../../utils/api";
import { toast } from "react-toastify";
import moment from "moment";
import { LuPlus, LuArrowRightLeft, LuTrash2, LuCreditCard, LuWallet, LuLandmark, LuEye, LuEyeOff, LuPencil, LuBriefcase, LuCoins, LuBuilding2 } from "react-icons/lu";
import AddAccountModal from "../../components/accounts/AddAccountModal";
import EditAccountModal from "../../components/accounts/EditAccountModal";
import TransferFundsModal from "../../components/accounts/TransferFundsModal";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import { SkeletonCard, SkeletonList } from "../../components/SkeletonLoader";

const renderAccountOutlineIcon = (type, name) => {
  const t = (type || "").toLowerCase();
  const n = (name || "").toLowerCase();

  if (t === "salary" || n.includes("salary")) return <LuBriefcase size={20} className="text-white" />;
  if (t === "savings" || n.includes("savings")) return <LuLandmark size={20} className="text-white" />;
  if (t === "checking" || n.includes("checking")) return <LuBuilding2 size={20} className="text-white" />;
  if (t === "credit" || n.includes("card") || n.includes("credit")) return <LuCreditCard size={20} className="text-white" />;
  if (t === "wallet" || n.includes("wallet")) return <LuWallet size={20} className="text-white" />;
  if (t === "cash" || n.includes("cash")) return <LuCoins size={20} className="text-white" />;
  return <LuLandmark size={20} className="text-white" />;
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [summary, setSummary] = useState({ totalLiquidCash: 0, totalCreditOwed: 0, netAssets: 0 });
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState({ show: false, account: null });
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Privacy Eye Toggle States (Hidden by default)
  const [hiddenSummary, setHiddenSummary] = useState({
    liquid: true,
    credit: true,
    netAssets: true,
  });
  const [hiddenAccounts, setHiddenAccounts] = useState({});
  const [hiddenTransfers, setHiddenTransfers] = useState(true);

  const toggleSummaryHide = (key) => {
    setHiddenSummary((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAccountHide = (id) => {
    setHiddenAccounts((prev) => ({ ...prev, [id]: prev[id] === false ? true : false }));
  };

  const fetchAccountsData = useCallback(async () => {
    try {
      setLoading(true);
      const [accRes, txRes] = await Promise.all([
        API.get("/api/v1/accounts/get"),
        API.get("/api/v1/accounts/transfers/get"),
      ]);

      if (accRes.data?.success) {
        setAccounts(accRes.data.accounts || []);
        setSummary(accRes.data.summary || {});
      }
      if (txRes.data?.success) {
        setTransfers(txRes.data.transfers || []);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to load accounts data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountsData();
  }, [fetchAccountsData]);

  const handleAddAccount = async (accountData) => {
    try {
      const res = await API.post("/api/v1/accounts/add", accountData);
      if (res.data?.success) {
        toast.success("Account added successfully!");
        setOpenAddModal(false);
        fetchAccountsData();
      }
    } catch (error) {
      console.error("Error adding account:", error);
      toast.error(error.response?.data?.message || "Failed to add account");
    }
  };

  const handleUpdateAccount = async (id, updatedData) => {
    try {
      const res = await API.put(`/api/v1/accounts/update/${id}`, updatedData);
      if (res.data?.success) {
        toast.success("Account updated successfully!");
        setOpenEditModal({ show: false, account: null });
        fetchAccountsData();
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(error.response?.data?.message || "Failed to update account");
    }
  };

  const handleTransferFunds = async (transferData) => {
    try {
      const res = await API.post("/api/v1/accounts/transfer", transferData);
      if (res.data?.success) {
        toast.success(res.data.message || "Transfer completed successfully!");
        setOpenTransferModal(false);
        fetchAccountsData();
      }
    } catch (error) {
      console.error("Error transferring funds:", error);
      toast.error(error.response?.data?.message || "Transfer failed");
    }
  };

  const deleteAccount = async (id) => {
    try {
      const res = await API.delete(`/api/v1/accounts/delete/${id}`);
      if (res.data?.success) {
        toast.success("Account deleted successfully!");
        setOpenDeleteAlert({ show: false, data: null });
        fetchAccountsData();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Accounts">
        <div className="my-3 mx-auto space-y-4">
          <SkeletonCard />
          <SkeletonList />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Accounts">
      <div className="my-3 mx-auto space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-800/80 border border-neutral-700/80 p-4 sm:p-5 md:p-6 rounded-2xl shadow-xl backdrop-blur-xl">
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-wide text-white">Accounts & Wallets</h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage bank accounts, credit cards, cash, and inter-account transfers</p>
          </div>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setOpenAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <LuPlus size={16} /> Add Account
            </button>
            <button
              onClick={() => setOpenTransferModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-neutral-700 hover:bg-neutral-600 text-gray-200 text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <LuArrowRightLeft size={16} /> Transfer
            </button>
          </div>
        </div>

        {/* Summary Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Total Liquid Cash */}
          <div className="bg-neutral-800/80 border border-neutral-700/80 p-4 rounded-2xl shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-neutral-700/80 border border-white/30 text-white flex items-center justify-center text-xl shrink-0">
                  <LuLandmark size={20} className="text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-medium truncate">Total Liquid Cash</p>
                  <h4 className="text-base md:text-lg font-bold text-emerald-400 truncate">
                    {hiddenSummary.liquid
                      ? "₹ ••••••"
                      : `₹ ${Number(summary.totalLiquidCash || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => toggleSummaryHide("liquid")}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 cursor-pointer shrink-0"
                title={hiddenSummary.liquid ? "Show Amount" : "Hide Amount"}
              >
                {hiddenSummary.liquid ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
          </div>

          {/* Total Credit Due */}
          <div className="bg-neutral-800/80 border border-neutral-700/80 p-4 rounded-2xl shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-neutral-700/80 border border-white/30 text-white flex items-center justify-center text-xl shrink-0">
                  <LuCreditCard size={20} className="text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-medium truncate">Total Credit Due</p>
                  <h4 className="text-base md:text-lg font-bold text-rose-400 truncate">
                    {hiddenSummary.credit
                      ? "₹ ••••••"
                      : `₹ ${Number(summary.totalCreditOwed || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => toggleSummaryHide("credit")}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 cursor-pointer shrink-0"
                title={hiddenSummary.credit ? "Show Amount" : "Hide Amount"}
              >
                {hiddenSummary.credit ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
          </div>

          {/* Net Assets Balance */}
          <div className="bg-neutral-800/80 border border-neutral-700/80 p-4 rounded-2xl shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-neutral-700/80 border border-white/30 text-white flex items-center justify-center text-xl shrink-0">
                  <LuWallet size={20} className="text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-medium truncate">Net Assets Balance</p>
                  <h4 className="text-base md:text-lg font-bold text-white truncate">
                    {hiddenSummary.netAssets
                      ? "₹ ••••••"
                      : `₹ ${Number(summary.netAssets || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => toggleSummaryHide("netAssets")}
                className="text-gray-400 hover:text-gray-200 transition-colors p-1 cursor-pointer shrink-0"
                title={hiddenSummary.netAssets ? "Show Amount" : "Hide Amount"}
              >
                {hiddenSummary.netAssets ? <LuEyeOff size={16} /> : <LuEye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const isCredit = acc.type === "credit";
            const creditLimit = Number(acc.creditLimit || 0);
            const balance = Number(acc.balance || 0);
            const utilization = creditLimit > 0 ? Math.min(100, Math.round((balance / creditLimit) * 100)) : 0;
            const isAccHidden = hiddenAccounts[acc._id] !== false;

            return (
              <div
                key={acc._id}
                className={`relative rounded-2xl p-4 sm:p-5 shadow-xl bg-gradient-to-r ${acc.color || "from-neutral-800 to-neutral-900"} text-white border border-white/10 flex flex-col justify-between min-h-[170px] gap-4`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 bg-black/30 rounded-xl backdrop-blur-sm shrink-0 border border-white/20 flex items-center justify-center">
                      {renderAccountOutlineIcon(acc.type, acc.name)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-base tracking-wide text-white truncate">{acc.name}</h4>
                      <p className="text-xs text-gray-200/80 uppercase tracking-wider font-semibold truncate">
                        {acc.type} {acc.accountNumberLast4 ? `• **** ${acc.accountNumberLast4}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleAccountHide(acc._id)}
                      className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
                      title={isAccHidden ? "Show Balance" : "Hide Balance"}
                    >
                      {isAccHidden ? <LuEyeOff size={16} /> : <LuEye size={16} />}
                    </button>
                    <button
                      onClick={() => setOpenEditModal({ show: true, account: acc })}
                      className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
                      title="Edit Account"
                    >
                      <LuPencil size={16} />
                    </button>
                    {!acc.isDefault && (
                      <button
                        onClick={() => setOpenDeleteAlert({ show: true, data: { id: acc._id, name: acc.name } })}
                        className="text-white/60 hover:text-rose-300 transition-colors p-1 cursor-pointer"
                        title="Delete Account"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-200/80 font-medium">
                    {isCredit ? "Current Bill Owed" : "Available Balance"}
                  </p>
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-wide mt-0.5">
                    {isAccHidden
                      ? "₹ ••••••"
                      : `₹ ${balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </h3>

                  {isCredit && creditLimit > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-200/90 font-semibold">
                        <span>
                          Limit: {isAccHidden ? "₹ ••••••" : `₹${creditLimit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </span>
                        <span>{utilization}% Used</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            utilization > 80 ? "bg-rose-400" : utilization > 50 ? "bg-amber-400" : "bg-emerald-400"
                          }`}
                          style={{ width: `${utilization}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transfer History Table */}
        <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-xl text-white">
          <h3 className="text-base md:text-lg font-bold border-b border-neutral-700/60 pb-3 text-gray-100">
            Recent Inter-Account Transfers
          </h3>

          <div className="hidden sm:grid grid-cols-[4fr_4fr_3fr_3fr] py-3 px-4 border-b border-neutral-700 text-gray-400 bg-neutral-900/60 rounded-xl mt-3 text-xs font-semibold uppercase tracking-wider">
            <p>From Account</p>
            <p>To Account</p>
            <p className="text-center">Date</p>
            <p className="text-right flex items-center justify-end gap-1.5">
              <span>Amount</span>
              <button
                onClick={() => setHiddenTransfers(!hiddenTransfers)}
                className="text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                title={hiddenTransfers ? "Show Amounts" : "Hide Amounts"}
              >
                {hiddenTransfers ? <LuEyeOff size={14} /> : <LuEye size={14} />}
              </button>
            </p>
          </div>

          <div className="flex flex-col divide-y divide-neutral-700/50 mt-1">
            {transfers.length === 0 ? (
              <p className="text-center py-6 text-xs text-gray-400">No inter-account transfers recorded yet.</p>
            ) : (
              transfers.map((tx) => (
                <div
                  key={tx._id}
                  className="py-3 px-3 sm:px-4 hover:bg-neutral-700/30 rounded-lg transition-all"
                >
                  {/* Mobile View */}
                  <div className="flex sm:hidden items-center justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-200">
                        <span className="text-gray-400 font-semibold">From:</span>
                        <span className="font-medium truncate">{tx.fromAccountId?.name || "Source Account"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-200">
                        <span className="text-gray-400 font-semibold">To:</span>
                        <span className="font-medium truncate">{tx.toAccountId?.name || "Destination Account"}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-medium pt-0.5">
                        {moment(tx.date).format("Do MMM YYYY")}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className="font-bold px-3 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
                        {hiddenTransfers
                          ? "⇄ ₹ ••••••"
                          : `⇄ ₹ ${Number(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden sm:grid sm:grid-cols-[4fr_4fr_3fr_3fr] items-center gap-2 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-neutral-700/80 rounded-lg border border-white/20 flex items-center justify-center">
                        {renderAccountOutlineIcon(tx.fromAccountId?.type, tx.fromAccountId?.name)}
                      </div>
                      <span className="font-medium text-gray-200">{tx.fromAccountId?.name || "Source Account"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-neutral-700/80 rounded-lg border border-white/20 flex items-center justify-center">
                        {renderAccountOutlineIcon(tx.toAccountId?.type, tx.toAccountId?.name)}
                      </div>
                      <span className="font-medium text-gray-200">{tx.toAccountId?.name || "Destination Account"}</span>
                    </div>
                    <p className="text-center text-gray-400 text-xs">
                      {moment(tx.date).format("Do MMM YYYY")}
                    </p>
                    <div className="flex justify-end">
                      <span className="font-bold px-3 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {hiddenTransfers
                          ? "⇄ ₹ ••••••"
                          : `⇄ ₹ ${Number(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        <AddAccountModal
          isOpen={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onAddAccount={handleAddAccount}
        />
        <EditAccountModal
          isOpen={openEditModal.show}
          onClose={() => setOpenEditModal({ show: false, account: null })}
          account={openEditModal.account}
          onUpdateAccount={handleUpdateAccount}
        />
        <TransferFundsModal
          isOpen={openTransferModal}
          onClose={() => setOpenTransferModal(false)}
          accounts={accounts}
          onTransfer={handleTransferFunds}
        />
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Account Alert"
        >
          <DeleteAlert
            content={`Are you sure you want to delete account "${openDeleteAlert.data?.name || "this account"}"`}
            onDelete={() => deleteAccount(openDeleteAlert.data?.id)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
