import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import 'dotenv/config';
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try{
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({ email });
        if(user) { 
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password : hashedPassword
        })
        if(newUser){
            const savedUser = await newUser.save();
            try {
                const clientUrl = process.env.CLIENT_URL;
                if (!clientUrl) {
                    console.warn('⚠️ CLIENT_URL is not set, skipping welcome email');
                } else {
                    await sendWelcomeEmail(savedUser.email, savedUser.username, clientUrl);
                    console.log('Welcome email sent successfully');
                }
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }
            generateToken(savedUser._id, res);
            res.status(201).json({
                _id : savedUser._id,
                username : savedUser.username,
                email : savedUser.email,
                profilePicture : savedUser.profilePicture
            });
        }else{
            return res.status(400).json({ message: "Failed to create user" });
        }
        
    }catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id : user._id,
            username : user.username,
            email : user.email,
            profilePicture : user.profilePicture
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (_, res) => {
    res.cookie("jwt", "", { maxAge: 0})
    res.status(200).json({ message: "Logged out successfully" });
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        if(!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        // Kiểm tra định dạng base64 hợp lệ
        const validFormats = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        const matches = profilePicture.match(/^data:(.+);base64,/);
        if(!matches || !validFormats.includes(matches[1])) {
            return res.status(400).json({ message: "Only JPEG, PNG, WEBP, GIF are allowed" });
        }

        // Kiểm tra kích thước (base64 ~1.37x so với file gốc)
        const base64Data = profilePicture.split(",")[1];
        const fileSizeInBytes = (base64Data.length * 3) / 4;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
        const MAX_SIZE_MB = 5;

        if(fileSizeInMB > MAX_SIZE_MB) {
            return res.status(400).json({ message: `File size must be less than ${MAX_SIZE_MB}MB` });
        }

        const userId = req.user._id;
        const upload = await cloudinary.uploader.upload(profilePicture, {
            resource_type: "image",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
            transformation: [
                { width: 500, height: 500, crop: "limit" }, 
                { quality: "auto" }                         
            ]
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePicture: upload.secure_url }, 
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}