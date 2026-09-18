const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  getAdminGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to view gallery items
router.get('/', getGalleryItems);

// Admin / Superadmin routes
router.get('/admin', protect, admin, getAdminGalleryItems);
router.post('/', protect, admin, createGalleryItem);
router.put('/:id', protect, admin, updateGalleryItem);
router.delete('/:id', protect, admin, deleteGalleryItem);

module.exports = router;
