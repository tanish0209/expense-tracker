import React, { useContext, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import DeleteAlert from "../../components/DeleteAlert";
import ExpenseOverview from "../../components/expense/ExpenseOverview";
import AddExpenseForm from "../../components/expense/AddExpenseForm";
import ExpenseList from "../../components/expense/ExpenseList";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const { backendUrl } = useContext(AppContext);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  //Get All Expense Details
  const fetchExpense = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get(backendUrl + "/api/v1/expense/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data) {
        setExpenseData(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  //Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category) {
      toast.error("category is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if (!date) {
      toast.error("Date is required");
    }
    try {
      await axios.post(
        backendUrl + "/api/v1/expense/add",
        { category, amount, date, icon },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully!");
      fetchExpense();
    } catch (error) {
      console.log("Error adding Expense:", error);
    }
  };
  //delete expense
  const deleteExpense = async (id) => {
    console.log("Attempting to delete expense with ID:", id);
    try {
      await axios.delete(backendUrl + `/api/v1/expense/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted successfully");
      fetchExpense();
    } catch (error) {
      console.log("Error deleting expense:", error);
    }
  };
  //handle Download expense Details
  const handleDownloadExpenseDetails = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/v1/expense/downloadexcel",
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Error downloading expense details", error);
    }
  };
  useEffect(() => {
    fetchExpense();
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto text-primary">
        <div className="grid grid-cols-1 gap-6">
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
