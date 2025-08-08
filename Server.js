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

app.use(express.json());
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
