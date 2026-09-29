import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import API from "../../utils/api";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import DeleteAlert from "../../components/DeleteAlert";
import ExpenseOverview from "../../components/expense/ExpenseOverview";
import AddExpenseForm from "../../components/expense/AddExpenseForm";
import ExpenseList from "../../components/expense/ExpenseList";
import { SkeletonCard, SkeletonList } from "../../components/SkeletonLoader";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  //Get All Expense Details
  const fetchExpense = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/v1/expense/get");
      if (res.data?.success) {
        setExpenseData(res.data.expense || res.data);
      }
    } catch (error) {
      console.error("Error fetching expense:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  //Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category) {
      toast.error("Category is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if (!date) {
      toast.error("Date is required");
      return;
    }
    try {
      await API.post("/api/v1/expense/add", { category, amount, date, icon });
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully!");
      fetchExpense();
    } catch (error) {
      console.error("Error adding Expense:", error);
      toast.error("Failed to add expense");
    }
  };

  //delete expense
  const deleteExpense = async (id) => {
    try {
      await API.delete(`/api/v1/expense/delete/${id}`);
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpense();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  //handle Download expense Details
  const handleDownloadExpenseDetails = async () => {
    try {
      const res = await API.get("/api/v1/expense/downloadexcel", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download file");
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [fetchExpense]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Expense">
        <div className="my-2 md:my-4 mx-auto space-y-3 md:space-y-6">
          <SkeletonCard />
          <SkeletonList />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-2 md:my-4 mx-auto text-primary">
        <div className="grid grid-cols-1 gap-3 md:gap-6">
          <div>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <div>
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
              onDownload={handleDownloadExpenseDetails}
            />
          </div>
        </div>
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Alert"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
