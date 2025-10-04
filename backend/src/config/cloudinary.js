let cloudinary;

try {
  cloudinary = require('cloudinary').v2;
} catch (error) {
  // Cloudinary not installed - create a mock object
  cloudinary = {
    config: () => {},
    uploader: {
      upload: () => Promise.reject(new Error('Cloudinary not configured')),
      destroy: () => Promise.reject(new Error('Cloudinary not configured')),
    },
    api: {
      ping: () => Promise.reject(new Error('Cloudinary not configured')),
    },
  };
}

const logger = require('./logger');

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  logger.info('Cloudinary disabled for local development');
}

// Test connection
const testConnection = async () => {
  try {
    // Only test if credentials are provided
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      await cloudinary.api.ping();
      logger.info('Cloudinary connection successful');
    } else {
      logger.info('Cloudinary disabled for local development');
    }
  } catch (error) {
    logger.error(`Cloudinary connection failed: ${error.message}`);
  }
};

testConnection();

module.exports = cloudinary;