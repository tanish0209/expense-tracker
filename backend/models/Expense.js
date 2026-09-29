import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

ExpenseSchema.index({ userId: 1, date: -1 });

const expenseModel = mongoose.models.expense || mongoose.model("expense", ExpenseSchema);
export default expenseModel;