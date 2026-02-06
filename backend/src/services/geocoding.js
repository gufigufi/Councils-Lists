import axios from 'axios';

/**
 * Geocode an address using Nominatim (OpenStreetMap)
 * @param {string} address - Full address to geocode
 * @returns {Promise<{lat: number, lon: number} | null>}
 */
export const geocodeAddress = async (address) => {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'EventMapFinder/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                lat: parseFloat(lat),
                lon: parseFloat(lon)
            };
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return null;
    }
};
