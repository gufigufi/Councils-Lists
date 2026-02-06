import express from 'express';
import {
    getAllCouncils,
    getCouncilById,
    createCouncil,
    updateCouncil,
    deleteCouncil,
    findNearestCouncils
} from '../controllers/councilController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllCouncils);
router.get('/:id', getCouncilById);
router.post('/search', findNearestCouncils);

// Protected routes (require authentication)
router.post('/', authenticateToken, createCouncil);
router.put('/:id', authenticateToken, updateCouncil);
router.delete('/:id', authenticateToken, deleteCouncil);

export default router;
