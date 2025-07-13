const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  cricksalArena: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cricksal', // Reference to CricksalArena model
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Time format like 'HH:mm'
    required: true
  },
  endTime: {
    type: String, // Time format like 'HH:mm'
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'upcoming', 'cancelled'],
    default: 'upcoming'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
});



const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
