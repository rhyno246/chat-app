import { create } from 'zustand';
import {  persist } from "zustand/middleware";
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';
export const useChatStore = create(
    persist(
        (set , get) => ({
            allContacts: [],
            chats: [],
            messages: [],
            activeTabs: "chats",
            selectedUser: null,
            isUsersLoading: false,
            isMessagesLoading: false,
            isSoundEnabled: false,
            toggleSound : () => {
                set((state) => ({ isSoundEnabled : !state.isSoundEnabled }))
            },
            setActiveTabs : (tab) => {
                set({ activeTabs : tab })
            },
            setSelectedUser : (select ) => {
                set({ selectedUser : select })
            },
            getAllContact : async () => {
                set({ isUsersLoading : true });
                try {
                    const res = await axiosInstance.get("/messages/contacts");
                    set({ allContacts : res.data })
                } catch (error) {
                    toast.error(error.response.data.message);
                    console.log(error)
                } finally {
                    set({ isUsersLoading : false })
                }
            },
            getMyChatPartners : async () => {
                set({ isUsersLoading : true });
                try {
                    const res = await axiosInstance.get("/messages/chats");
                    set({ chats : res.data })
                } catch (error) {
                    toast.error(error.response.data.message);
                    console.log(error)
                } finally {
                    set({ isUsersLoading : false })
                }
            },
            getMessagesUserById : async(userId) => {
                set({ isMessagesLoading: true });
                try {
                const res = await axiosInstance.get(`/messages/${userId}`);
                    set({ messages: res.data });
                } catch (error) {
                    toast.error(error.response?.data?.message || "Something went wrong");
                } finally {
                    set({ isMessagesLoading: false });
                }
            },
            sendMessage : async (messageData) => {
                const { selectedUser, messages } = get();
                const { authUser } = useAuthStore.getState();
                const tempId = `temp-${Date.now()}`;
                const optimisticMessage = {
                    _id: tempId,
                    senderId: authUser._id,
                    receiverId: selectedUser._id,
                    content: messageData.text,
                    image: messageData.image,
                    createdAt: new Date().toISOString(),
                    isOptimistic: true, // flag to identify optimistic messages (optional)
                };
                set({ messages: [...messages, optimisticMessage] });
                 try {
                    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
                    set({ messages: messages.concat(res.data) });
                } catch (error) {
                    // remove optimistic message on failure
                    set({ messages: messages });
                    toast.error(error.response?.data?.message || "Something went wrong");
                }
            },
            subscribeToMessages : () => {
                
            }
        }),
        {
            name: "sound-chat", 
            partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled })
        }
    )
);