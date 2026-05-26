"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useSchools } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { useSchoolCache } from "@/lib/store/schoolCache";
import { getInitials, getLocalizedName, fixImageUrl } from "@/lib/utils";

const SCHOOL_COLORS = ["#0D9488", "#7C3AED", "#EA580C", "#059669", "#318B9B", "#DC2626", "#B45309", "#1D4ED8"];

export default function SchoolsPage() {
  const { locale } = useUiStore();
  const cacheSchool = useSchoolCache((s) => s.set);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSchools({ search: search || undefined, per_page: 50 });
  const schools = data?.data ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {locale === "ar" ? "المدارس" : "Schools"}
      </h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={locale === "ar" ? "ابحث عن مدرسة..." : "Search for a school..."}
          className="w-full ps-10 pe-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]"
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : schools.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="font-medium">{locale === "ar" ? "لا توجد مدارس" : "No schools found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {schools.map((school, i) => {
            const color = SCHOOL_COLORS[i % SCHOOL_COLORS.length];
            const name = getLocalizedName(school.name, locale);
            return (
              <Link
                key={school.id}
                href={`/school/${school.id}`}
                onClick={() => cacheSchool(school)}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 flex flex-col items-center gap-3 hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base overflow-hidden flex-shrink-0"
                  style={{ background: school.logo_url ? "transparent" : color }}
                >
                  {school.logo_url
                    ? <Image src={fixImageUrl(school.logo_url)} alt={name} width={56} height={56} className="w-full h-full object-contain" />
                    : getInitials(name)
                  }
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">{name}</p>
                  {school.curriculum && (
                    <span className="mt-1.5 inline-block text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                      {school.curriculum}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
