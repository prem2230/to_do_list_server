
import express from 'express';
import { getUser, loginUser, refreshToken, registerUser } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users/getUser',authMiddleware, getUser);
router.post('/users/refreshToken', refreshToken);

export default router;