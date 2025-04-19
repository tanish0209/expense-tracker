import React, { useContext, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/income/IncomeOverview";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/income/AddIncomeForm";
import { toast } from "react-toastify";
import IncomeList from "../../components/income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const { backendUrl } = useContext(AppContext);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  //Get All Income Details
  const fetchIncome = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get(backendUrl + "/api/v1/income/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data) {
        setIncomeData(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  //Handle Add income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;
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
    }
    try {
      await axios.post(
        backendUrl + "/api/v1/income/add",
        { source, amount, date, icon },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully!");
      fetchIncome();
    } catch (error) {
      console.log("Error adding income:", error);
    }
  };
  //delete income
  const deleteIncome = async (id) => {
    console.log("Attempting to delete income with ID:", id);
    try {
      await axios.delete(backendUrl + `/api/v1/income/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income details deleted successfully");
      fetchIncome();
    } catch (error) {
      console.log("Error deleting income:", error);
    }
  };
  //handle Download Income Details
  const handleDownloadIncomeDetails = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/v1/income/downloadexcel", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
      console.log("Error downloading income details", error);
    }
  };
  useEffect(() => {
    fetchIncome();
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto text-primary">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <div>
            <IncomeList
              transactions={incomeData}
              onDelete={(id) => {
                setOpenDeleteAlert({ show: true, data: id });
              }}
              onDownload={handleDownloadIncomeDetails}
            />
          </div>
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
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
