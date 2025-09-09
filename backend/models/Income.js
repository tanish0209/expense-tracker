import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    source: { type: String, required: true },
    amount: { type: Number, rerquired: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true })

const incomeModel = mongoose.models.income || mongoose.model("income", IncomeSchema);
export default incomeModel;