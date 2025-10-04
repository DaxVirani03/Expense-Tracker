const Tesseract = require('tesseract.js');
const logger = require('./logger');

// OCR Configuration
const ocrConfig = {
  provider: process.env.OCR_PROVIDER || 'tesseract', // tesseract or google-vision
  googleVision: {
    keyFilePath: process.env.GOOGLE_VISION_KEY_PATH,
  },
  tesseract: {
    lang: 'eng',
    logger: (m) => {
      if (m.status === 'recognizing text') {
        logger.debug(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  },
};

// Tesseract OCR
const extractTextWithTesseract = async (imagePath) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, 'eng', {
      logger: ocrConfig.tesseract.logger,
    });
    return text;
  } catch (error) {
    logger.error(`Tesseract OCR error: ${error.message}`);
    throw error;
  }
};

// Google Vision OCR (optional)
const extractTextWithGoogleVision = async (imagePath) => {
  try {
    if (!ocrConfig.googleVision.keyFilePath) {
      throw new Error('Google Vision API key file not configured');
    }

    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient({
      keyFilename: ocrConfig.googleVision.keyFilePath,
    });

    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    return detections[0] ? detections[0].description : '';
  } catch (error) {
    logger.error(`Google Vision OCR error: ${error.message}`);
    throw error;
  }
};

// Main OCR function
const extractText = async (imagePath) => {
  if (ocrConfig.provider === 'google-vision') {
    return await extractTextWithGoogleVision(imagePath);
  }
  return await extractTextWithTesseract(imagePath);
};

// Extract structured data from receipt text
const extractReceiptData = (text) => {
  const data = {
    amount: null,
    date: null,
    vendor: null,
    description: null,
  };

  // Extract amount (various currency formats)
  const amountRegex = /(?:Rs\.?|₹|\$|USD|EUR|GBP)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi;
  const amounts = text.match(amountRegex);
  if (amounts && amounts.length > 0) {
    // Take the largest amount as it's likely the total
    data.amount = amounts
      .map((a) => parseFloat(a.replace(/[^\d.]/g, '')))
      .sort((a, b) => b - a)[0];
  }

  // Extract date (various formats)
  const dateRegex = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})|(\d{4}[-/]\d{1,2}[-/]\d{1,2})/gi;
  const dates = text.match(dateRegex);
  if (dates && dates.length > 0) {
    data.date = dates[0];
  }

  // Extract vendor name (usually at the top of receipt)
  const lines = text.split('\n').filter((line) => line.trim().length > 2);
  if (lines.length > 0) {
    data.vendor = lines[0].trim();
  }

  return data;
};

module.exports = {
  extractText,
  extractReceiptData,
  ocrConfig,
};