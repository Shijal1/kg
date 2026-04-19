// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['dining', 'party', 'special'],
    required: true,
    default: 'dining'
  },
  tableType: {
    type: String,
    enum: ['1-sitter', '2-sitter', '3-sitter', '4-sitter', 'family-pack', 'birthday-party', 'group-5-6'],
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  specialRequests: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'qr', 'card', 'digital_wallet'],
    default: 'cash'
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  bookingNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Add virtual for booking reference
bookingSchema.virtual('bookingRef').get(function() {
  return `BOOK${this._id.toString().substring(18, 24).toUpperCase()}`;
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;