import express from 'express';
import {
    getAllCouncils,
    getCouncilById,
    createCouncil,
    updateCouncil,
    deleteCouncil,
    findNearestCouncils
} from '../controllers/councilController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCouncils);
router.get('/:id', getCouncilById);
router.post('/search', findNearestCouncils);

// Admin routes (site protected by password gate)
router.post('/', createCouncil);
router.put('/:id', updateCouncil);
router.delete('/:id', deleteCouncil);

export default router;
