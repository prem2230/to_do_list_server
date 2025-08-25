import mongoose from "mongoose";
import connectDB from "../../utils/database";

mongoose.connect = jest.fn();
consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
describe("Database Connection", () => {
    it("should attempt to connect to the database with correct parameters", async () => {
        process.env.MONGO_URI = "mongodb://localhost:27017/testdb";
        mongoose.connect.mockResolvedValueOnce();
        await connectDB();
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        });
        mongoose.connect.mockRestore();
        expect(consoleSpy).toHaveBeenCalledWith('MongoDB Connected Successfully.');
    });
    it("should log an error message if connection fails", async () => {
        const errorMessage = "Failed to connect";
        mongoose.connect.mockRejectedValueOnce(new Error(errorMessage));
        await connectDB();
        expect(consoleSpy).toHaveBeenCalledWith('Error Connecting Database', errorMessage);
        mongoose.connect.mockRestore();
    });
})