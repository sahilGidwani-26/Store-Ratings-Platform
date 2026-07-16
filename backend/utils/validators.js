const { body } = require('express-validator');

// Name: 20-60 characters
const nameValidator = (field = 'name') =>
  body(field)
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage(`${field} must be between 20 and 60 characters`);

// Address: max 400 characters
const addressValidator = (field = 'address') =>
  body(field)
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage(`${field} must be at most 400 characters`);

// Password: 8-16 chars, at least 1 uppercase, 1 special character
const passwordValidator = (field = 'password') =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;']/)
    .withMessage('Password must contain at least one special character');

const emailValidator = (field = 'email') =>
  body(field).trim().isEmail().withMessage('A valid email is required').normalizeEmail();

module.exports = { nameValidator, addressValidator, passwordValidator, emailValidator };
