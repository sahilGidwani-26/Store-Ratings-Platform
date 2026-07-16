const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../utils/handleValidation');
const { nameValidator, addressValidator, passwordValidator, emailValidator } = require('../utils/validators');

router.post(
  '/register',
  [nameValidator(), emailValidator(), addressValidator(), passwordValidator()],
  validate,
  authController.register
);

router.post('/login', authController.login);

router.put(
  '/password',
  protect,
  [
    passwordValidator('newPassword'),
    require('express-validator').body('currentPassword').notEmpty().withMessage('Current password is required'),
  ],
  validate,
  authController.updatePassword
);

router.get('/me', protect, authController.getMe);

module.exports = router;
