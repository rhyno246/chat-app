import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import 'dotenv/config';
import cloudinary from "../lib/cloundinary.js";

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
        const userId = req.user._id;
        const upload = await cloudinary.uploader.upload(profilePicture);
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePicture: upload.secure_url }, 
            { new: true }
        ).select("-password"); // not get password in response
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

}