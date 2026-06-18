import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser : null,
    isCheckingAuth : true,
    isSigningUp : false,
    isLogin : false,
    onlineUsers: [],
    checkAuth : async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser : res.data })
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
    }
}))