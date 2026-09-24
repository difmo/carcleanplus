const express = require('express');
const router = express.Router();
const FestivalSetting = require('../models/FestivalSetting');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/festival
// @desc    Get active festival settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let setting = await FestivalSetting.findOne();
    if (!setting) {
      setting = await FestivalSetting.create({
        activeFestival: 'DIWALI',
        isOfferActive: true,
      });
    }
    return res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error) {
    console.error('Error fetching festival settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching festival settings',
      data: { activeFestival: 'DIWALI', isOfferActive: true },
    });
  }
});

// @route   PUT /api/festival
// @desc    Update active festival and offer settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
  try {
    const { activeFestival, isOfferActive, customOfferPrice, customDiscount } = req.body;

    let setting = await FestivalSetting.findOne();
    if (!setting) {
      setting = new FestivalSetting();
    }

    if (activeFestival) setting.activeFestival = activeFestival;
    if (typeof isOfferActive === 'boolean') setting.isOfferActive = isOfferActive;
    if (customOfferPrice !== undefined) setting.customOfferPrice = customOfferPrice;
    if (customDiscount !== undefined) setting.customDiscount = customDiscount;
    if (req.user) setting.updatedBy = req.user.name || req.user.email || 'Admin';

    await setting.save();

    return res.status(200).json({
      success: true,
      message: 'Festival settings updated successfully',
      data: setting,
    });
  } catch (error) {
    console.error('Error updating festival settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating festival settings',
    });
  }
});

module.exports = router;
