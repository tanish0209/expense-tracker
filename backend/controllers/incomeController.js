import xlsx from "xlsx";
import incomeModel from "../models/Income.js";

const addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;
        if (!source || !amount || !date) {
            return res.json({ success: false, message: "All Fields Are Required" });
        }
        const newIncome = new incomeModel({
            userId,
            icon,
            source,
            amount: Number(amount),
            date: new Date(date)
        });
        await newIncome.save();
        res.json({ success: true, newIncome });
    } catch (error) {
        console.error("Add income error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 }).lean();
        res.json({ success: true, income });
    } catch (error) {
        console.error("Get income error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const deletedItem = await incomeModel.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Income not found or unauthorized" });
        }
        res.json({ success: true, message: "Income Deleted Successfully" });
    } catch (error) {
        console.error("Delete income error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 }).lean();

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date ? new Date(item.date).toLocaleDateString() : ""
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        
        const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", 'attachment; filename="income_details.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        return res.send(buffer);
    } catch (error) {
        console.error("Download income excel error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel };