const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    kind: { type: String, enum: ['percent', 'flat'], default: 'flat' },
    value: { type: Number, required: true },
    active: { type: Boolean, default: true },
    maxUses: { type: Number, default: 0 },
    used: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Promo', promoSchema);
