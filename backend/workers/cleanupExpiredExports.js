const mongoose = require('mongoose');
const ExportJob = require('../models/ExportJob');
const fs = require('fs');

require('dotenv').config();

async function cleanupExpiredExports() {
  await mongoose.connect(process.env.MONGO_URI);

  const now = new Date();

  const expiredJobs = await ExportJob.find({
    expiresAt: { $lt: now },
    status: 'completed',
  });

  for (const job of expiredJobs) {
    try {
      if (job.filePath && fs.existsSync(job.filePath)) {
        fs.unlinkSync(job.filePath);
      }
      await ExportJob.deleteOne({ _id: job._id });
      console.log(`Cleaned up export job ${job._id}`);
    } catch (err) {
      console.error(`Error cleaning export job ${job._id}:`, err);
    }
  }

  await mongoose.disconnect();
}

cleanupExpiredExports().then(() => {
  console.log('Cleanup complete');
  process.exit(0);
});