const logger = require('../config/logger');

// Cache for exchange rates (refresh every 1 hour)
let exchangeRateCache = {
  rates: {},
  lastUpdated: null,
};

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch exchange rates from API (disabled for local development)
 * @param {string} baseCurrency - Base currency code (e.g., 'USD')
 * @returns {Object} - Exchange rates object
 */
const fetchExchangeRates = async (baseCurrency = 'USD') => {
  // For local development, return static rates
  logger.warn('Using static exchange rates for local development');
  return getStaticExchangeRates(baseCurrency);
};

/**
 * Get static exchange rates for local development
 * @param {string} baseCurrency - Base currency code
 * @returns {Object} - Static exchange rates
 */
const getStaticExchangeRates = (baseCurrency = 'USD') => {
  // Static rates as of October 2025 (approximate)
  const staticRates = {
    USD: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 150,
      INR: 83,
      AUD: 1.35,
      CAD: 1.25,
      CHF: 0.92,
      CNY: 7.1,
      SEK: 10.5,
      NZD: 1.4,
      SGD: 1.32,
      HKD: 7.8,
    },
    EUR: {
      USD: 1.18,
      EUR: 1,
      GBP: 0.86,
      JPY: 176,
      INR: 98,
      AUD: 1.59,
      CAD: 1.47,
      CHF: 1.08,
      CNY: 8.35,
      SEK: 12.35,
      NZD: 1.65,
      SGD: 1.55,
      HKD: 9.18,
    },
    INR: {
      USD: 0.012,
      EUR: 0.0102,
      GBP: 0.0088,
      JPY: 1.8,
      INR: 1,
      AUD: 0.0162,
      CAD: 0.015,
      CHF: 0.011,
      CNY: 0.085,
      SEK: 0.126,
      NZD: 0.017,
      SGD: 0.016,
      HKD: 0.094,
    },
  };

  return staticRates[baseCurrency] || staticRates.USD;
};

/**
 * Get exchange rates with caching
 * @param {string} baseCurrency - Base currency code
 * @returns {Object} - Exchange rates object
 */
const getExchangeRates = async (baseCurrency = 'USD') => {
  const now = Date.now();
  const cacheKey = baseCurrency;
  
  // Check if cache is valid
  if (
    exchangeRateCache.rates[cacheKey] &&
    exchangeRateCache.lastUpdated &&
    now - exchangeRateCache.lastUpdated < CACHE_DURATION
  ) {
    return exchangeRateCache.rates[cacheKey];
  }
  
  // Fetch new rates
  const rates = await fetchExchangeRates(baseCurrency);
  
  // Update cache
  exchangeRateCache.rates[cacheKey] = rates;
  exchangeRateCache.lastUpdated = now;
  
  return rates;
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} - Converted amount
 */
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  try {
    const rates = await getExchangeRates(fromCurrency);
    
    if (!rates[toCurrency]) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }
    
    const convertedAmount = amount * rates[toCurrency];
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    logger.error(`Currency conversion error: ${error.message}`);
    throw error;
  }
};

/**
 * Get currency symbol
 * @param {string} currencyCode - Currency code (e.g., 'USD')
 * @returns {string} - Currency symbol
 */
const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    INR: '₹',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    SEK: 'kr',
    NZD: 'NZ$',
  };
  
  return symbols[currencyCode] || currencyCode;
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @returns {string} - Formatted currency string
 */
const formatCurrency = (amount, currencyCode = 'USD') => {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${symbol}${formattedAmount}`;
};

/**
 * Get list of supported currencies
 * @returns {Array} - Array of currency objects
 */
const getSupportedCurrencies = () => {
  return [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  ];
};

/**
 * Validate currency code
 * @param {string} currencyCode - Currency code to validate
 * @returns {boolean} - True if valid
 */
const isValidCurrency = (currencyCode) => {
  const supportedCurrencies = getSupportedCurrencies();
  return supportedCurrencies.some((currency) => currency.code === currencyCode);
};

module.exports = {
  getExchangeRates,
  convertCurrency,
  getCurrencySymbol,
  formatCurrency,
  getSupportedCurrencies,
  isValidCurrency,
};