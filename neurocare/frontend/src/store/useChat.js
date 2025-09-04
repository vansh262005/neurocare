import { create } from 'zustand';

export const useChat = create((set) => ({
  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] }))
}));