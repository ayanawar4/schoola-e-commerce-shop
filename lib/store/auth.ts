"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  pendingPhone: string | null;
  pendingCountryCode: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setPendingPhone: (phone: string, countryCode: string) => void;
  clearPendingPhone: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      pendingPhone: null,
      pendingCountryCode: null,

      login: (token, user) => {
        localStorage.setItem("schoola_token", token);
        Cookies.set("token", token, { expires: 30, sameSite: "lax" });
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("schoola_token");
        localStorage.removeItem("schoola_user");
        Cookies.remove("token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      setPendingPhone: (phone, countryCode) =>
        set({ pendingPhone: phone, pendingCountryCode: countryCode }),

      clearPendingPhone: () =>
        set({ pendingPhone: null, pendingCountryCode: null }),
    }),
    {
      name: "schoola_auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
