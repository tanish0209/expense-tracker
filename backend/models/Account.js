import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["savings", "checking", "credit", "wallet", "crypto", "cash"],
      default: "savings",
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    accountNumberLast4: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "🏦",
    },
    color: {
      type: String,
      default: "from-indigo-600 to-blue-700",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

accountSchema.index({ userId: 1, type: 1 });

const Account = mongoose.model("Account", accountSchema);
export default Account;
