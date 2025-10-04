import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';

const PasswordStrength = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1; // lowercase
    if (/[A-Z]/.test(password)) score += 1; // uppercase
    if (/[0-9]/.test(password)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special characters

    // Determine strength level
    if (score <= 2) {
      return { level: 1, label: 'Weak', color: 'red' };
    } else if (score <= 4) {
      return { level: 2, label: 'Medium', color: 'orange' };
    } else {
      return { level: 3, label: 'Strong', color: 'green' };
    }
  }, [password]);

  const requirements = [
    { test: password.length >= 8, label: 'At least 8 characters' },
    { test: /[a-z]/.test(password), label: 'One lowercase letter' },
    { test: /[A-Z]/.test(password), label: 'One uppercase letter' },
    { test: /[0-9]/.test(password), label: 'One number' },
    { test: /[^a-zA-Z0-9]/.test(password), label: 'One special character' },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={clsx(
              'h-2 rounded-full transition-all duration-300',
              strength.color === 'red' && 'bg-red-500 w-1/3',
              strength.color === 'orange' && 'bg-orange-500 w-2/3',
              strength.color === 'green' && 'bg-green-500 w-full'
            )}
          />
        </div>
        <span
          className={clsx(
            'text-sm font-medium',
            strength.color === 'red' && 'text-red-600',
            strength.color === 'orange' && 'text-orange-600',
            strength.color === 'green' && 'text-green-600'
          )}
        >
          {strength.label}
        </span>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div
            key={index}
            className={clsx(
              'flex items-center text-xs transition-colors duration-200',
              req.test ? 'text-green-600' : 'text-gray-500'
            )}
          >
            {req.test ? (
              <svg
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
};

PasswordStrength.propTypes = {
  password: PropTypes.string,
};

export default PasswordStrength;
