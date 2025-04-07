const express = require('express');
const propertyController = require('../controllers/propertyController');
const { check, validationResult } = require('express-validator');
const { verifyJWT, requireRole } = require('../middleware/auth');

const router = express.Router();

// @desc    Placeholder Properties Route
// @route   GET /api/v1/properties/placeholder
// @access  Public (or Private later)
router.get('/placeholder', propertyController.placeholder);
/**
 * @route   POST /api/v1/properties
 * @desc    Create new property
 * @access  Private (requires auth, assumed)
 */
router.post(
  '/',
  verifyJWT,
  requireRole('admin'),
  [
    check('name', 'Name is required').notEmpty(),
    check('address', 'Address is required').notEmpty(),
    check('price', 'Price must be a positive number').isFloat({ gt: 0 }),
  ],
  propertyController.createProperty
);

router.put(
  '/:id',
  verifyJWT,
  requireRole('admin'),
  [
    check('name', 'Name is required').optional().notEmpty(),
    check('address', 'Address is required').optional().notEmpty(),
    check('price', 'Price must be a positive number').optional().isFloat({ gt: 0 }),
  ],
  propertyController.updateProperty
);

module.exports = router;
