import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.js';

const Payment = db.Payment;
const Order = db.Order;
const User = db.User;

export const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount } = req.body;
    
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const transactionId = `TXN${uuidv4().substring(0, 8).toUpperCase()}`;

    // Cash on Delivery handling
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

    const payment = await Payment.create({
      orderId,
      userId: req.user.id,
      paymentMethod,
      amount,
      transactionId,
      paymentStatus
    });

    await order.save();

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const completePayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const payment = await Payment.findOne({ where: { transactionId } });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.paymentStatus = 'completed';
    payment.paymentDate = new Date();
    payment.qrScanned = true;

    await payment.save();

    // Update order
    const order = await Order.findByPk(payment.orderId);
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
    
    const payment = await Payment.findOne({
      where: { orderId },
      include: [
        { model: Order, as: 'order' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
