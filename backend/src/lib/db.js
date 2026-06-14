import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const data = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${data.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // 1 status code means fails
    }
}