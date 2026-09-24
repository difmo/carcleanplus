const mongoose = require('mongoose');

const festivalSettingSchema = new mongoose.Schema(
  {
    activeFestival: {
      type: String,
      default: 'DIWALI',
      enum: ['DIWALI', 'HOLI', 'NAVRATRI', 'EID', 'NEWYEAR', 'GENERAL'],
    },
    isOfferActive: {
      type: Boolean,
      default: true,
    },
    customOfferPrice: {
      type: String,
      default: '',
    },
    customDiscount: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: 'Admin',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FestivalSetting', festivalSettingSchema);
