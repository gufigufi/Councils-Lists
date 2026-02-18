/**
 * Format distance for display
 */
export const formatDistance = (miles) => {
    return `${miles.toFixed(1)} mi`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
};
