const Gallery = require('../models/Gallery');

// @desc    Get all active gallery items (public)
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    const items = await Gallery.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gallery items',
      error: error.message
    });
  }
};

// @desc    Get all gallery items for admin (includes inactive)
// @route   GET /api/gallery/admin
// @access  Private/Admin
const getAdminGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find()
      .sort({ order: 1, createdAt: -1 })
      .populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching admin gallery items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gallery items',
      error: error.message
    });
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category, imageUrl, altText, isActive, order } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    const newItem = await Gallery.create({
      title: title || '',
      description: description || '',
      category: category || 'Exterior Cleaning',
      imageUrl,
      altText: altText || title || 'Car Clean Plus Work',
      uploadedBy: req.user ? req.user._id : null,
      isActive: typeof isActive === 'boolean' ? isActive : true,
      order: order ? Number(order) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item uploaded successfully',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating gallery item',
      error: error.message
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, imageUrl, altText, isActive, order } = req.body;

    let item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (category !== undefined) item.category = category;
    if (imageUrl) item.imageUrl = imageUrl;
    if (altText !== undefined) item.altText = altText;
    if (typeof isActive === 'boolean') item.isActive = isActive;
    if (order !== undefined) item.order = Number(order);

    await item.save();

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating gallery item',
      error: error.message
    });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gallery item',
      error: error.message
    });
  }
};

module.exports = {
  getGalleryItems,
  getAdminGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
