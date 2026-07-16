const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../utils/handleValidation');
const { nameValidator, addressValidator, passwordValidator, emailValidator } = require('../utils/validators');

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.dashboard);

router.post(
  '/users',
  [nameValidator(), emailValidator(), addressValidator(), passwordValidator()],
  validate,
  adminController.createUser
);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetails);

router.post(
  '/stores',
  [nameValidator(), emailValidator(), addressValidator()],
  validate,
  adminController.createStore
);
router.get('/stores', adminController.listStores);

module.exports = router;
