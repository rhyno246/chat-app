import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/user.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        if (!loggedInUserId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const filteredUsers = await User.find(
            {
                _id: { $ne: loggedInUserId } // Lấy tất cả users có _id KHÁC loggedInUserId
            }
        ).select("-password");
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
         const messages = await Message.find({
            $or: [
                {senderId : loggedInUserId},
                {receiverId : loggedInUserId}
            ]
         })
         const chatPartnerIds = [...new Set(messages.map(msg => 
            msg.senderId.toString() === loggedInUserId.toString() 
            ? msg.receiverId.toString() 
            : msg.senderId.toString()
        ))];

        const chatPartners = await User.find({
            _id : { $in: chatPartnerIds} //Lấy tất cả users có _id nằm TRONG mảng chatPartnerIds
        }).select("-password");
        res.status(200).json(chatPartners);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getMessagesByUserId = async (req, res) => {
    try {
        const myUserId = req.user._id;
        const { id : userTochatId } =  req.params;
        const messages = await Message.find({
            $or:[
                {senderId : myUserId, receiverId : userTochatId},
                {senderId : userTochatId, receiverId : myUserId}
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { content , image } = req.body;
        const { id : receiverId } =  req.params;
        const senderId = req.user._id;
        if (!content && !image) {
          return res.status(400).json({ message: "Message must have content or image" });
        }
        const receiver = await User.findById(receiverId);
        if (!receiver) {
           return res.status(404).json({ message: "Receiver not found" });
        }
        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            image : imageUrl
        })
        await newMessage.save();

        //send realtime if user is online

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}