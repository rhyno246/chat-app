import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

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
            await newUser.save();
            generateToken(newUser._id, res);
            return res.status(201).json({
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                profilePicture : newUser.profilePicture
            })
        }else{
            return res.status(400).json({ message: "Failed to create user" });
        }
        
    }catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}