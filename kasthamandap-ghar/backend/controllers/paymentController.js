import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';

export const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const transactionId = `TXN${uuidv4().substring(0, 8).toUpperCase()}`;

    // 🔹 FIX: Cash on Delivery handling
    let paymentStatus = 'pending';

    if (paymentMethod === 'cash') {
      // COD → payment remains pending until delivery
      paymentStatus = 'pending';
      order.isPaid = false;
      order.paymentMethod = 'Cash on Delivery';
    } else {
      // Online / QR payment
      paymentStatus = 'completed';
      order.isPaid = true;
    }

    const payment = new Payment({
      order: orderId,
      user: req.user._id,
      paymentMethod,
      amount,
      transactionId,
      paymentStatus
    });

    const createdPayment = await payment.save();
    await order.save();

    res.status(201).json(createdPayment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const completePayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.paymentStatus = 'completed';
    payment.paymentDate = Date.now();
    payment.qrScanned = true;

    await payment.save();

    // Update order
    const order = await Order.findById(payment.order);
    if (order) {
      order.isPaid = true;
      await order.save();
    }

    res.json({ message: 'Payment completed successfully', payment });
  } catch (error) {
    console.error('Complete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ order: orderId })
      .populate('order')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
