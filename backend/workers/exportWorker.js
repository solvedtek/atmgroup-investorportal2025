const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { format } = require('@fast-csv/format');
const PDFDocument = require('pdfkit');
const Property = require('../models/Property');
const ExportJob = require('../models/ExportJob');
const crypto = require('crypto');

// Connect to MongoDB if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atmgroup', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('Worker connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const exportWorker = new Worker(
  'exportQueue',
  async (job) => {
    console.log(`Processing export job ${job.id} for user ${job.data.userId}`);

    try {
      // Fetch properties based on filters (simplified example)
      const filters = job.data.filters || {};
      const properties = await Property.find(filters).lean();

      console.log(`Fetched ${properties.length} properties`);

      const exportDir = path.join(__dirname, '../../exports');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      if (job.data.format === 'pdf') {
        const filePath = path.join(exportDir, `export_${job.id}.pdf`);
        const doc = new PDFDocument();
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        doc.fontSize(18).text('Property Export', { align: 'center' });
        doc.moveDown();

        properties.forEach((prop, idx) => {
          doc.fontSize(12).text(`Property #${idx + 1}`);
          doc.text(`Address: ${prop.address?.street || ''}`);
          doc.text(`Country: ${prop.address?.country || ''}`);
          doc.text(`Purchase Price: ${prop.purchasePrice}`);
          doc.text(`Current Value: ${prop.currentValue}`);
          doc.text(`Status: ${prop.status}`);
          doc.text(`Property Type: ${prop.propertyType}`);
          doc.moveDown();
        });

        doc.end();

        writeStream.on('finish', async () => {
          console.log(`PDF export saved to ${filePath}`);
          try {
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
  
            await ExportJob.findOneAndUpdate(
              { jobId: job.id },
              {
                jobId: job.id,
                userId: job.data.userId,
                status: 'completed',
                filePath,
                downloadToken: token,
                expiresAt,
              },
              { upsert: true, new: true }
            );
  
            console.log(`Export job ${job.id} metadata saved with token ${token}`);
          } catch (err) {
            console.error(`Failed to save export job metadata: ${err.message}`);
          }
        });

      } else {
        // Default to CSV export
        const filePath = path.join(exportDir, `export_${job.id}.csv`);
        const writeStream = fs.createWriteStream(filePath);

        const csvStream = format({ headers: true });
        csvStream.pipe(writeStream).on('finish', () => {
          console.log(`CSV export saved to ${filePath}`);
          // TODO: Generate secure download link, update job status, notify user
        });

        properties.forEach((prop) => {
          csvStream.write({
            Address: prop.address?.street || '',
            Country: prop.address?.country || '',
            PurchasePrice: prop.purchasePrice,
            CurrentValue: prop.currentValue,
            Status: prop.status,
            PropertyType: prop.propertyType,
          });
        });

        csvStream.end();
      }

    } catch (err) {
      console.error(`Export job ${job.id} failed: ${err.message}`);
      throw err;
    }

    console.log(`Export job ${job.id} completed`);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  }
);

exportWorker.on('completed', (job) => {
  console.log(`Export job ${job.id} completed successfully`);
});

exportWorker.on('failed', (job, err) => {
  console.error(`Export job ${job.id} failed: ${err.message}`);
});