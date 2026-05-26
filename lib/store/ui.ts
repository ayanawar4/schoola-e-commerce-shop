"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface UiState {
  locale: "ar" | "en";
  darkMode: boolean;
  setLocale: (locale: "ar" | "en") => void;
  toggleDarkMode: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: "en",
      darkMode: false,

      setLocale: (locale) => {
        Cookies.set("locale", locale, { expires: 365, sameSite: "lax" });
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
        set({ locale });
      },

      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode;
          document.documentElement.classList.toggle("dark", next);
          return { darkMode: next };
        }),
    }),
    {
      name: "schoola_ui",
      version: 2,
      migrate: (state: any) => ({ ...state, darkMode: false }),
    }
  )
);
