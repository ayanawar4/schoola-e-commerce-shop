import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { School } from "@/types";

interface SchoolCacheStore {
  cache: Record<number, School>;
  set: (school: School) => void;
}

export const useSchoolCache = create<SchoolCacheStore>()(
  persist(
    (set) => ({
      cache: {},
      set: (school) =>
        set((s) => ({ cache: { ...s.cache, [school.id]: school } })),
    }),
    { name: "school-cache" }
  )
);
