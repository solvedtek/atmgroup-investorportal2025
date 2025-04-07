const express = require('express');
const { verifyJWT, requireRole } = require('../middleware/auth');
const exportController = require('../controllers/exportController');

const router = express.Router();

/**
 * @route POST /api/v1/export
 * @desc  Enqueue export job
 * @access Private
 */
const { check, validationResult } = require('express-validator');

router.post(
  '/',
  verifyJWT,
  requireRole('investor', 'admin'),
  [
    check('userId', 'User ID is required').notEmpty().isString().trim().escape(),
    check('filters').optional().isObject(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  exportController.enqueueExport
);

const ExportJob = require('../models/ExportJob');
const path = require('path');
const fs = require('fs');

/**
 * @route GET /api/v1/export/status/:jobId
 * @desc  Get export job status and download URL if ready
 * @access Private
 */
router.get(
  '/status/:jobId',
  verifyJWT,
  requireRole('investor', 'admin'),
  exportController.getExportStatus
);

/**
 * @route GET /api/v1/export/download/:token
 * @desc  Download export file if token is valid
 * @access Private
 */
router.get(
  '/download/:token',
  exportController.downloadExportFile
);

module.exports = router;