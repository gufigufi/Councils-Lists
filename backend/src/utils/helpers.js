/**
 * Helper functions for backend
 */

/**
 * Format date to ISO string
 */
export const formatDate = (date) => {
    return new Date(date).toISOString();
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate zip code format (US)
 */
export const isValidZipCode = (zipCode) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
};
