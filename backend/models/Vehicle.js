const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    plate: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
