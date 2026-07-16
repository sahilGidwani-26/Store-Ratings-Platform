const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('owner'));

router.get('/dashboard', ownerController.dashboard);

module.exports = router;
