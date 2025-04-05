const express = require('express');
const router = express.Router();

// @desc    Placeholder Auth Route
// @route   GET /api/v1/auth/placeholder
// @access  Public
router.get('/placeholder', (req, res) => {
  res.status(200).json({ success: true, message: 'Auth route placeholder' });
});

module.exports = router;