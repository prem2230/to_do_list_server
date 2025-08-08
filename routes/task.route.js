import express from 'express';
import { addTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/tasks', addTask);
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

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