const express = require('express');
const { check, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// @desc    Placeholder Auth Route
// @route   GET /api/v1/auth/placeholder
// @access  Public
router.get('/placeholder', (req, res) => {
  res.status(200).json({ success: true, message: 'Auth route placeholder' });
});
/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').notEmpty(),
  ],
  login
);

module.exports = router;
