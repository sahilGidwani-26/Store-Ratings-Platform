const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', storeController.listStores);
router.post('/:id/ratings', storeController.submitRating);
router.put('/:id/ratings', storeController.updateRating);

module.exports = router;
