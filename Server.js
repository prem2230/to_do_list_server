import express from 'express';
import { configDotenv } from 'dotenv';
import taskRouter from './routes/task.route.js';
import connectDB from './config/database.js';

const app = express();
configDotenv();

app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB()

app.use('/api/v1',taskRouter);

app.listen(PORT,() => {
    console.log(`Server running on Port: ${PORT}`);
})
