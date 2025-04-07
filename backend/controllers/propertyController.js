const propertyService = require('../services/propertyService');
const { validationResult } = require('express-validator');

/**
 * @desc Placeholder property endpoint
 */
exports.placeholder = (req, res) => {
  res.status(200).json({ success: true, message: 'Properties route placeholder' });
};

/**
 * @desc Create new property
 */
exports.createProperty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const result = await propertyService.createProperty(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update property
 */
exports.updateProperty = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const result = await propertyService.updateProperty(req.params.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};