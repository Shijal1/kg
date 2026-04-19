import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [orderItemSchema],

  shippingAddress: {
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },

  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery'
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0
  },

  taxPrice: {
    type: Number,
    required: true,
    default: 0
  },

  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  isDelivered: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'out for delivery',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },

  // 🔹 Shipping Tracking Fields
  shippingTracking: {
    status: {
      type: String,
      enum: ['preparing', 'dispatched', 'on_the_way', 'delivered'],
      default: 'preparing'
    },
    estimatedDelivery: Date,
    deliveryPerson: String,
    deliveryPersonPhone: String,
    currentLocation: {
      lat: Number,
      lng: Number,
      address: String
    },
    trackingId: String,
    deliveryNotes: String
  },

  // 🔹 Booking reference for dine-in orders
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }

}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
