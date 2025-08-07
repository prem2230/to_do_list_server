import express from 'express';
import { configDotenv } from 'dotenv';

const app = express();
configDotenv();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.status(200).json({
        message:'Hello World',
        success:true
    });
});

app.listen(PORT,() => {
    console.log(`Server running on Port: ${PORT}`);
})
