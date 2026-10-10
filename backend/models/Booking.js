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
      city: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
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
    paymentMethod: { type: String, enum: ['Online', 'Cash', 'UPI', 'Pending', 'N/A'], default: 'Online' },
    status: {
      type: String,
      enum: ['lead', 'pending', 'confirmed', 'accepted', 'on_the_way', 'in_progress', 'completed', 'cancelled', 'blocked'],
      default: 'lead',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingSource: {
      type: String,
      enum: ['website', 'phone', 'admin_block', 'app'],
      default: 'website'
    },
    addons: [{ name: String, price: Number }],
    promoCode: { type: String, default: '' },
    discount: { type: Number, default: 0 },
    travelFee: { type: Number, default: 0 },
    creditUsed: { type: Number, default: 0 },
    planUsed: { type: Boolean, default: false },
    rating: { type: Number },
    review: { type: String, default: '' },
    beforePhoto: { type: String, default: '' },
    afterPhoto: { type: String, default: '' },
    collectedCash: { type: Number, default: 0 },
    collectedUpi: { type: Number, default: 0 },
    refundAmount: { type: Number, default: 0 },
    branch: { type: String, default: '' },
    paymentLinkId: { type: String, default: '' },
    paymentUrl: { type: String, default: '' },
    clockedInAt: { type: Date },
    washerName: { type: String, default: '' },
    washerPhone: { type: String, default: '' },
    timeline: [{
      status: { type: String, required: true },
      at: { type: Date, default: Date.now },
      byName: { type: String, default: '' },
      byRole: { type: String, default: '' },
    }],
    reports: [{
      note: { type: String, default: '' },
      image: { type: String, default: '' },
      at: { type: Date, default: Date.now },
      byName: { type: String, default: '' },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
