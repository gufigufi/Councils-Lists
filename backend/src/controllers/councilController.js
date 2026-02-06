import { PrismaClient } from '@prisma/client';
import { geocodeAddress } from '../services/geocoding.js';
import { calculateDistance } from '../services/distance.js';

const prisma = new PrismaClient();

/**
 * Get all councils
 */
export const getAllCouncils = async (req, res) => {
    try {
        const councils = await prisma.council.findMany({
            orderBy: { purchaseDate: 'desc' }
        });

        res.json(councils);
    } catch (error) {
        console.error('Error fetching councils:', error);
        res.status(500).json({ error: 'Failed to fetch councils' });
    }
};

/**
 * Get single council by ID
 */
export const getCouncilById = async (req, res) => {
    try {
        const { id } = req.params;

        const council = await prisma.council.findUnique({
            where: { id }
        });

        if (!council) {
            return res.status(404).json({ error: 'Council not found' });
        }

        res.json(council);
    } catch (error) {
        console.error('Error fetching council:', error);
        res.status(500).json({ error: 'Failed to fetch council' });
    }
};

/**
 * Normalize and validate date string
 */
const normalizeDate = (dateString) => {
    // Remove any extra text and parse the date
    const cleanedDate = dateString.trim();
    const parsed = new Date(cleanedDate);

    // Validate if it's a valid date
    if (isNaN(parsed.getTime())) {
        throw new Error(`Invalid date: ${dateString}`);
    }

    return parsed;
};

/**
 * Create new council with automatic geocoding
 */
export const createCouncil = async (req, res) => {
    try {
        const { purchaseDate, endDate, name, email, address, zipCode, state } = req.body;

        // Validate required fields
        if (!purchaseDate || !endDate || !name || !email || !address || !zipCode || !state) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Normalize and validate dates
        let normalizedPurchaseDate, normalizedEndDate;
        try {
            normalizedPurchaseDate = normalizeDate(purchaseDate);
            normalizedEndDate = normalizeDate(endDate);
        } catch (error) {
            return res.status(400).json({
                error: 'Invalid date format. Please use YYYY-MM-DD format.'
            });
        }

        // Geocode the address
        const fullAddress = `${address}, ${zipCode}, ${state}`;
        const coordinates = await geocodeAddress(fullAddress);

        if (!coordinates) {
            return res.status(400).json({
                error: 'Could not geocode address. Please check the address format.'
            });
        }

        // Create council
        const council = await prisma.council.create({
            data: {
                purchaseDate: normalizedPurchaseDate,
                endDate: normalizedEndDate,
                name,
                email,
                address,
                zipCode,
                state,
                latitude: coordinates.lat,
                longitude: coordinates.lon
            }
        });

        res.status(201).json(council);
    } catch (error) {
        console.error('Error creating council:', error);
        res.status(500).json({ error: 'Failed to create council' });
    }
};

/**
 * Update council
 */
export const updateCouncil = async (req, res) => {
    try {
        const { id } = req.params;
        const { purchaseDate, endDate, name, email, address, zipCode, state } = req.body;

        // Check if council exists
        const existingCouncil = await prisma.council.findUnique({
            where: { id }
        });

        if (!existingCouncil) {
            return res.status(404).json({ error: 'Council not found' });
        }

        // If address changed, re-geocode
        let latitude = existingCouncil.latitude;
        let longitude = existingCouncil.longitude;

        if (address !== existingCouncil.address || zipCode !== existingCouncil.zipCode || state !== existingCouncil.state) {
            const fullAddress = `${address}, ${zipCode}, ${state}`;
            const coordinates = await geocodeAddress(fullAddress);

            if (coordinates) {
                latitude = coordinates.lat;
                longitude = coordinates.lon;
            }
        }

        // Update council
        const updatedCouncil = await prisma.council.update({
            where: { id },
            data: {
                purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                name,
                email,
                address,
                zipCode,
                state,
                latitude,
                longitude
            }
        });

        res.json(updatedCouncil);
    } catch (error) {
        console.error('Error updating council:', error);
        res.status(500).json({ error: 'Failed to update council' });
    }
};

/**
 * Delete council
 */
export const deleteCouncil = async (req, res) => {
    try {
        const { id } = req.params;

        const council = await prisma.council.findUnique({
            where: { id }
        });

        if (!council) {
            return res.status(404).json({ error: 'Council not found' });
        }

        await prisma.council.delete({
            where: { id }
        });

        res.json({ message: 'Council deleted successfully' });
    } catch (error) {
        console.error('Error deleting council:', error);
        res.status(500).json({ error: 'Failed to delete council' });
    }
};

/**
 * Find nearest councils to a given address
 */
export const findNearestCouncils = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        // Geocode the search address
        const searchCoords = await geocodeAddress(address);

        if (!searchCoords) {
            return res.status(400).json({
                error: 'Could not geocode the provided address'
            });
        }

        // Get all councils with coordinates
        const allCouncils = await prisma.council.findMany({
            where: {
                latitude: { not: null },
                longitude: { not: null }
            }
        });

        // Calculate distances and sort
        const councilsWithDistance = allCouncils.map(council => ({
            ...council,
            distance: calculateDistance(
                searchCoords.lat,
                searchCoords.lon,
                council.latitude,
                council.longitude
            )
        })).sort((a, b) => a.distance - b.distance);

        // Return top 5 nearest councils
        const nearestCouncils = councilsWithDistance.slice(0, 5);

        res.json({
            searchLocation: {
                address,
                latitude: searchCoords.lat,
                longitude: searchCoords.lon
            },
            councils: nearestCouncils
        });
    } catch (error) {
        console.error('Error finding nearest councils:', error);
        res.status(500).json({ error: 'Failed to find nearest councils' });
    }
};
