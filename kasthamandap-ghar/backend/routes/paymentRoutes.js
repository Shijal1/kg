import express from 'express';
import {
  createPayment,
  completePayment,
  getPaymentStatus
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createPayment);
router.post('/complete/:transactionId', protect, completePayment);
router.get('/status/:orderId', protect, getPaymentStatus);

export default router;