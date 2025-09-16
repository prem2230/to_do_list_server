import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Wait 5s to find MongoDB server
            socketTimeoutMS: 45000,         // Wait 45s for MongoDB response
            maxPoolSize: 10                 // Max 10 simultaneous connections
        });
        console.log('MongoDB Connected Successfully.');
    }catch(error){
        console.log('Error Connecting Database',error.message);
        console.log('Shutting down the server.');
        process.exit(1);

    }
}

export default connectDB;