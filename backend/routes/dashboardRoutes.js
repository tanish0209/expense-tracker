import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { getDashboardData } from '../controllers/dashboardController.js';

const Dashrouter = express.Router();
Dashrouter.get("/", protect, getDashboardData);
export default Dashrouter;
