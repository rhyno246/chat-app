import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/";

export const useAuthStore = create((set,get) => ({
    authUser : null,
    isCheckingAuth : true,
    isSigningUp : false,
    isLogin : false,
    onlineUsers: [],
    socket : null,
    checkAuth : async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser : res.data })
            get().connectSocket();
        } catch (error) {
            console.log(error);
            set({ authUser : null })
        } finally { 
            set({ isCheckingAuth : false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp : true });
        try {
            const res = await axiosInstance.post("/auth/signup" , data);
            set({ authUser : res.data })
            toast.success("Account created successfully")
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        } finally {
            set({ isSigningUp : false })
        }
    },
    login : async (data) => {
        set({ isLogin : true });
        try {
            const res = await axiosInstance.post("/auth/login" , data);
            set({ authUser : res.data })
            toast.success("Account login successfully")
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        } finally {
            set({ isLogin : false })
        }
    },
    logout : async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser : null })
            toast.success("Logout successfully")
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error Logging out")
            console.log(error)
        }
    },
    updateProfile : async (data) => {
        console.log(data)
        try {
            const res = await axiosInstance.put("/auth/update-profile" , data);
            set({ authUser : res.data});
            toast.success("Update avatar successfully")
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error)
        }
    },
    connectSocket : () => {
        const { authUser } = get();
        if(!authUser || get().socket?.connected){
            return
        }
        const socket = io(BASE_URL , {
            withCredentials : true
        })
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
        
        socket.connect();
        set({ socket })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}))