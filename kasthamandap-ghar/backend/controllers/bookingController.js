// controllers/bookingController.js
import Booking from '../models/Booking.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      bookingType,
      tableType,
      bookingDate,
      timeSlot,
      numberOfGuests,
      specialRequests,
      contactPhone,
      contactEmail,
      paymentMethod
    } = req.body;

    // Calculate price based on table type
    const priceMap = {
      '1-sitter': 0,
      '2-sitter': 0,
      '3-sitter': 0,
      '4-sitter': 0,
      'family-pack': 500,
      'birthday-party': 1000,
      'group-5-6': 800
    };

    const totalPrice = priceMap[tableType] || 0;
    const depositAmount = ['birthday-party', 'group-5-6'].includes(tableType) ? totalPrice * 0.5 : 0;

    const booking = new Booking({
      user: req.user._id,
      bookingType,
      tableType,
      bookingDate: new Date(bookingDate),
      timeSlot,
      numberOfGuests,
      specialRequests,
      contactPhone,
      contactEmail,
      paymentMethod,
      totalPrice,
      depositAmount,
      status: depositAmount > 0 ? 'pending' : 'confirmed'
    });

    const createdBooking = await booking.save();
    
    // If deposit required, create payment record
    if (depositAmount > 0) {
      // Create payment record logic here
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = req.body.status;
    
    if (req.body.status === 'confirmed') {
      booking.bookingNotes = `Confirmed by admin at ${new Date().toLocaleString()}`;
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get available time slots
// @route   GET /api/bookings/availability
// @access  Public
export const getAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Generate time slots
    const timeSlots = [
      '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
      '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
    ];

    // Check bookings for the date
    const bookings = await Booking.find({
      bookingDate: {
        $gte: new Date(date + 'T00:00:00'),
        $lt: new Date(date + 'T23:59:59')
      },
      status: { $in: ['confirmed', 'pending'] }
    });

    // Calculate availability
    const availableSlots = timeSlots.map(slot => {
      const bookingsInSlot = bookings.filter(b => b.timeSlot === slot);
      const bookedTables = bookingsInSlot.length;
      const totalTables = 20; // Total tables in restaurant
      
      return {
        time: slot,
        available: bookedTables < totalTables,
        bookedTables,
        availableTables: totalTables - bookedTables
      };
    });

    res.json(availableSlots);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};