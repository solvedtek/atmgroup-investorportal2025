const exportQueue = require('../queues/exportQueue');
const ExportJob = require('../models/ExportJob');
const path = require('path');
const fs = require('fs');

exports.enqueueExport = async (req, res) => {
  const { userId, filters } = req.body;

  const job = await exportQueue.add('generateExport', {
    userId,
    filters,
  });

  res.status(202).json({
    message: 'Export job enqueued',
    jobId: job.id,
  });
};

exports.getExportStatus = async (req, res) => {
  try {
    const job = await ExportJob.findOne({ jobId: req.params.jobId });
    if (!job) {
      return res.status(404).json({ message: 'Export job not found' });
    }

    let downloadUrl = null;
    if (job.status === 'completed' && job.downloadToken && job.expiresAt > new Date()) {
      downloadUrl = `/api/v1/export/download/${job.downloadToken}`;
    }

    res.json({
      status: job.status,
      downloadUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.downloadExportFile = async (req, res) => {
  try {
    const job = await ExportJob.findOne({ downloadToken: req.params.token });
    if (!job || job.expiresAt < new Date()) {
      return res.status(404).json({ message: 'Invalid or expired download link' });
    }

    const filePath = job.filePath;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, path.basename(filePath));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};