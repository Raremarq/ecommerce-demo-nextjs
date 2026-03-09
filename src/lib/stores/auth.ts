"use client";

import { create } from "zustand";
import type { User } from "@/db/schema";

interface AuthState {
  currentUser: User | null;
  isAuthModalOpen: boolean;
  setUser: (user: User | null) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthModalOpen: false,
  setUser: (user) => set({ currentUser: user }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
