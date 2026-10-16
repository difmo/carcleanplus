const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const account = require('../controllers/accountController');

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    res.status(500).json({ success: false, message: error.message });
  });

router.use(protect);
router.get('/vehicles', wrap(account.listVehicles));
router.post('/vehicles', wrap(account.addVehicle));
router.put('/vehicles/:id/default', wrap(account.setDefaultVehicle));
router.delete('/vehicles/:id', wrap(account.removeVehicle));
router.get('/addresses', wrap(account.listAddresses));
router.post('/addresses', wrap(account.addAddress));
router.put('/addresses/:id/default', wrap(account.setDefaultAddress));
router.delete('/addresses/:id', wrap(account.removeAddress));
router.get('/notifications', wrap(account.listNotifications));
router.put('/notifications/read', wrap(account.markNotificationsRead));
router.post('/push-token', wrap(account.savePushToken));
router.delete('/push-token', wrap(account.removePushToken));
router.get('/plan', wrap(account.getPlan));
router.post('/plan', wrap(account.buyPlan));
router.post('/referral', wrap(account.applyReferral));

module.exports = router;
