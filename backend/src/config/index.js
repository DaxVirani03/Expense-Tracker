const connectDB = require('./db');
const cloudinary = require('./cloudinary');
const ocr = require('./ocr');
const logger = require('./logger');

module.exports = {
  connectDB,
  cloudinary,
  ocr,
  logger,
};