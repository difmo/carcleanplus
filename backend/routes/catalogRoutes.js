const express = require('express');
const router = express.Router();
const { protect, optionalProtect, admin } = require('../middleware/authMiddleware');
const { readCatalog, updateCatalog, quote } = require('../controllers/catalogController');

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    res.status(500).json({ success: false, message: error.message });
  });

router.get('/', optionalProtect, wrap(readCatalog));
router.post('/quote', optionalProtect, wrap(quote));
router.put('/', protect, admin, wrap(updateCatalog));

module.exports = router;
