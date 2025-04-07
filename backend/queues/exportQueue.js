const { Queue } = require('bullmq');

const exportQueue = new Queue('exportQueue', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
});

module.exports = exportQueue;