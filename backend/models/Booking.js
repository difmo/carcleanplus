const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    carModel: {
      name: { type: String, required: function() { return this.status !== 'lead'; } },
      category: { type: String, required: function() { return this.status !== 'lead'; } }
    },
    service: { type: String, required: function() { return this.status !== 'lead'; } },
    location: {
      address: { type: String, required: function() { return this.status !== 'lead'; } },
      pincode: { type: String },
      city: { type: String }
    },
    date: { type: String, required: function() { return this.status !== 'lead'; } },
    timeSlot: { type: String, required: function() { return this.status !== 'lead'; } },
    customerDetails: {
      fullName: { type: String, required: function() { return this.status !== 'lead'; } },
      mobile: { type: String, required: true },
      instructions: { type: String }
    },
    finalPrice: { type: Number, required: function() { return this.status !== 'lead'; } },
    paymentId: { type: String },
    orderId: { type: String },
    paymentStatus: { type: String },
    status: {
      type: String,
      enum: ['lead', 'pending', 'confirmed', 'completed', 'cancelled'],
      default: 'lead',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
