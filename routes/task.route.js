import express from 'express';
import { addTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/task.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/tasks',authMiddleware, addTask);
router.get('/tasks',authMiddleware, getTasks);
router.get('/tasks/:id',authMiddleware, getTask);
router.put('/tasks/:id',authMiddleware, updateTask);
router.delete('/tasks/:id',authMiddleware, deleteTask);

router.all('/tasks/:id', (req, res) => {
    const allowedMethods = ['GET', 'PUT', 'DELETE'];
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({
            success: false,
            message: `Method ${req.method} not allowed. Allowed: ${allowedMethods.join(', ')}`
        });
    }
});

router.all('/tasks', (req, res) => {
    const allowedMethods = ['GET', 'POST'];
    
    if (req.method === 'HEAD') {
        return res.status(200).end(); 
    }
    
    if (req.method === 'OPTIONS') {
        return res.status(200)
            .header('Allow', allowedMethods.join(', '))
            .end();
    }
    
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({
            success: false,
            message: `Method ${req.method} not allowed. Allowed: ${allowedMethods.join(', ')}`
        });
    }
});

export default router;