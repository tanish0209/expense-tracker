import express from 'express'
import { getUserInfo, loginUser, registerUser } from '../controllers/authController.js';
import protect from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);
export default router;