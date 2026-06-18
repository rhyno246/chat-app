import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messagesRoutes from './routes/messages.route.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { connectDB } from './lib/db.js';
import cloudinary from './lib/cloudinary.js';
dotenv.config();
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT;
app.use(express.json({ limit: "10mb" })); // use req.body
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser()); // use req.cookies
app.use(cors({ origin : process.env.CLIENT_URL, credentials : true }))
app.use("/api/auth" , authRoutes);
app.use("/api/messages" , messagesRoutes);


//deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*" , (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
