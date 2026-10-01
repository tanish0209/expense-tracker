import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/income/IncomeOverview";
import API from "../../utils/api";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/income/AddIncomeForm";
import { toast } from "react-toastify";
import IncomeList from "../../components/income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { SkeletonCard, SkeletonList } from "../../components/SkeletonLoader";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  //Get All Income Details
  const fetchIncome = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/v1/income/get");
      if (res.data?.success) {
        setIncomeData(res.data.income || res.data);
      }
    } catch (error) {
      console.error("Error fetching income:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  //Handle Add or Update income
  const handleSaveIncome = async (income) => {
    const { source, amount, date, icon, accountId } = income;
    if (!source) {
      toast.error("Source is required");
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
      if (editingIncome) {
        await API.put(`/api/v1/income/update/${editingIncome._id}`, {
          source,
          amount,
          date,
          icon,
          accountId,
        });
        toast.success("Income details updated successfully!");
      } else {
        await API.post("/api/v1/income/add", { source, amount, date, icon, accountId });
        toast.success("Income added successfully!");
      }
      setOpenAddIncomeModal(false);
      setEditingIncome(null);
      fetchIncome();
    } catch (error) {
      console.error("Error saving income:", error);
      toast.error(editingIncome ? "Failed to update income" : "Failed to add income");
    }
  };

  //delete income
  const deleteIncome = async (id) => {
    try {
      await API.delete(`/api/v1/income/delete/${id}`);
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncome();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income");
    }
  };

  //handle Download Income Details
  const handleDownloadIncomeDetails = async (dateBounds = {}) => {
    try {
      const params = {};
      if (dateBounds?.startDate) params.startDate = dateBounds.startDate;
      if (dateBounds?.endDate) params.endDate = dateBounds.endDate;

      const res = await API.get("/api/v1/income/downloadexcel", {
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download file");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Income">
        <div className="my-2 md:my-4 mx-auto space-y-3 md:space-y-6">
          <SkeletonCard />
          <SkeletonList />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-2 md:my-4 mx-auto text-primary">
        <div className="grid grid-cols-1 gap-3 md:gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => {
                setEditingIncome(null);
                setOpenAddIncomeModal(true);
              }}
            />
          </div>
          <div>
            <IncomeList
              transactions={incomeData}
              onEdit={(incomeItem) => {
                setEditingIncome(incomeItem);
                setOpenAddIncomeModal(true);
              }}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
              onDownload={handleDownloadIncomeDetails}
            />
          </div>
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => {
            setOpenAddIncomeModal(false);
            setEditingIncome(null);
          }}
          title={editingIncome ? "Edit Income" : "Add Income"}
        >
          <AddIncomeForm
            initialData={editingIncome}
            onAddIncome={handleSaveIncome}
          />
        </Modal>
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Alert"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
