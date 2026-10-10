const express = require('express');
const router = express.Router();
const { protect, staff } = require('../middleware/authMiddleware');
const { getMyJobs, getMyJob, updateMyJobStatus, setShift, savePhotos, collectPayment, clockIn, getMySummary } = require('../controllers/staffController');

router.use(protect, staff);
router.get('/jobs', getMyJobs);
router.get('/summary', getMySummary);
router.put('/shift', setShift);
router.get('/jobs/:id', getMyJob);
router.put('/jobs/:id/status', updateMyJobStatus);
router.put('/jobs/:id/photos', savePhotos);
router.put('/jobs/:id/collect', collectPayment);
router.put('/jobs/:id/clock-in', clockIn);

module.exports = router;
