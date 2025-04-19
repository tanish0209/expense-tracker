import xlsx from "xlsx"
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
            icon, source, amount, date: new Date(date)
        });
        await newIncome.save();
        res.json({ success: true, newIncome });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server Error" });
    }
};

const getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, income })
    } catch (error) {
        res.json({ success: false, message: "Server Error" });
    }
};

const deleteIncome = async (req, res) => {

    try {
        await incomeModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Income Deleted Successfully" })
    } catch (error) {
        res.json({ success: false, message: "Server Error" });
    }
};

const downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await incomeModel.find({ userId }).sort({ date: -1 });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }));
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, 'income_details.xlsx');
        res.download("income_details.xlsx")
    } catch (error) {
        res.json({ success: false, message: "Server Error" });
    }
};

export { addIncome, getAllIncome, deleteIncome, downloadIncomeExcel }