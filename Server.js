import express from 'express';
import { configDotenv } from 'dotenv';
import taskRouter from './routes/task.route.js';
import connectDB from './utils/database.js';
import rateLimit from 'express-rate-limit';

const app = express();
configDotenv();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            return res.status(400).json({
                success: false,
                message: 'Content-Type must be application/json'
            });
        }
    }
    next();
});

app.use(express.json());

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON format in request body'
        });
    }
    next(error);
});

app.use('/api/', limiter);

const PORT = process.env.PORT || 3000;

connectDB()

app.use('/api/v1',taskRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
})

app.listen(PORT,() => {
    console.log(`Server running on Port: ${PORT}`);
})
