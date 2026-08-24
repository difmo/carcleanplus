const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    carModel: {
      name: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      }
    },
    service: {
      type: String,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
      }
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    customerDetails: {
      fullName: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      instructions: {
        type: String,
      }
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
