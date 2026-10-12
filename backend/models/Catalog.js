const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'main', unique: true },
    prices: [
      {
        category: String,
        service: String,
        amount: Number,
        active: { type: Boolean, default: true },
      },
    ],
    addons: [
      {
        name: String,
        amount: Number,
        active: { type: Boolean, default: true },
      },
    ],
    plans: [
      {
        name: String,
        washes: Number,
        amount: Number,
        service: String,
      },
    ],
    slotCapacity: { type: Number, default: 4 },
    freeRadiusKm: { type: Number, default: 8 },
    zoneKm: { type: Number, default: 25 },
    travelFee: { type: Number, default: 49 },
    staffPayPerJob: { type: Number, default: 150 },
    gstPercent: { type: Number, default: 18 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Catalog', catalogSchema);
