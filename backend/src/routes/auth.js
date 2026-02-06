import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticate admin user
 */
router.post('/login', login);

/**
 * POST /api/auth/register
 * Create new admin user
 */
router.post('/register', register);

export default router;
