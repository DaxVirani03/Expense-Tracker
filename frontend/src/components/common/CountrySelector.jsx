import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';

// Country to currency mapping (comprehensive list)
const COUNTRIES = [
  { name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { name: 'India', currency: 'INR', flag: '🇮🇳' },
  { name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  { name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { name: 'Italy', currency: 'EUR', flag: '🇮🇹' },
  { name: 'Spain', currency: 'EUR', flag: '🇪🇸' },
  { name: 'Netherlands', currency: 'EUR', flag: '🇳🇱' },
  { name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { name: 'China', currency: 'CNY', flag: '🇨🇳' },
  { name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
  { name: 'Hong Kong', currency: 'HKD', flag: '🇭🇰' },
  { name: 'Switzerland', currency: 'CHF', flag: '🇨🇭' },
  { name: 'Sweden', currency: 'SEK', flag: '🇸🇪' },
  { name: 'Norway', currency: 'NOK', flag: '🇳🇴' },
  { name: 'Denmark', currency: 'DKK', flag: '🇩🇰' },
  { name: 'New Zealand', currency: 'NZD', flag: '🇳🇿' },
  { name: 'South Korea', currency: 'KRW', flag: '🇰🇷' },
  { name: 'Brazil', currency: 'BRL', flag: '🇧🇷' },
  { name: 'Mexico', currency: 'MXN', flag: '🇲🇽' },
  { name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
  { name: 'United Arab Emirates', currency: 'AED', flag: '🇦🇪' },
  { name: 'Saudi Arabia', currency: 'SAR', flag: '🇸🇦' },
  { name: 'Turkey', currency: 'TRY', flag: '🇹🇷' },
  { name: 'Russia', currency: 'RUB', flag: '🇷🇺' },
  { name: 'Poland', currency: 'PLN', flag: '🇵🇱' },
  { name: 'Thailand', currency: 'THB', flag: '🇹🇭' },
  { name: 'Malaysia', currency: 'MYR', flag: '🇲🇾' },
  { name: 'Indonesia', currency: 'IDR', flag: '🇮🇩' },
  { name: 'Philippines', currency: 'PHP', flag: '🇵🇭' },
  { name: 'Vietnam', currency: 'VND', flag: '🇻🇳' },
  { name: 'Egypt', currency: 'EGP', flag: '🇪🇬' },
  { name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
  { name: 'Kenya', currency: 'KES', flag: '🇰🇪' },
  { name: 'Argentina', currency: 'ARS', flag: '🇦🇷' },
  { name: 'Chile', currency: 'CLP', flag: '🇨🇱' },
  { name: 'Colombia', currency: 'COP', flag: '🇨🇴' },
  { name: 'Peru', currency: 'PEN', flag: '🇵🇪' },
];

const CountrySelector = ({
  label = 'Country',
  name = 'country',
  value,
  onChange,
  error,
  required = false,
  showCurrency = true,
  placeholder = 'Select your country',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return COUNTRIES;
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.name === value);
  }, [value]);

  const handleSelect = (country) => {
    onChange({ target: { name, value: country.name } });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'w-full px-4 py-3 text-left rounded-lg border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'flex items-center justify-between',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          )}
        >
          <span className="flex items-center">
            {selectedCountry ? (
              <>
                <span className="mr-2 text-xl">{selectedCountry.flag}</span>
                <span className="text-gray-900">{selectedCountry.name}</span>
                {showCurrency && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({selectedCountry.currency})
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
          <svg
            className={clsx(
              'h-5 w-5 text-gray-400 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Info tooltip */}
        <div className="mt-1 text-xs text-gray-500 flex items-center">
          <svg
            className="h-4 w-4 mr-1 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          This will set your company's base currency
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-52">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.name}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={clsx(
                      'w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors flex items-center justify-between',
                      selectedCountry?.name === country.name && 'bg-blue-100'
                    )}
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {country.currency}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No countries found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg
            className="h-4 w-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

CountrySelector.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  showCurrency: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default CountrySelector;
