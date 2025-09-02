
import express from 'express';
import { getUser, loginUser, registerUser } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/getUser',authMiddleware, getUser);

export default router;