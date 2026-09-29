import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fromAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    toAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Transfer amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

transferSchema.index({ userId: 1, date: -1 });

const Transfer = mongoose.model("Transfer", transferSchema);
export default Transfer;
