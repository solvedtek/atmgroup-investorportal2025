const express = require('express');

const router = express.Router();

// @desc    Placeholder Properties Route
// @route   GET /api/v1/properties/placeholder
// @access  Public (or Private later)
router.get('/placeholder', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'Properties route placeholder' });
});

module.exports = router;
