import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  transferFunds,
  getTransfers,
} from "../controllers/accountController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/get", getAccounts);
router.post("/add", addAccount);
router.put("/update/:id", updateAccount);
router.delete("/delete/:id", deleteAccount);

router.post("/transfer", transferFunds);
router.get("/transfers/get", getTransfers);

export default router;
