import express from 'express';
import { addTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/task.controller.js';

const router = express.Router();

router.post('/tasks', addTask);
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;