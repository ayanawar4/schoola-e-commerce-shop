"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSchools } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { useSchoolCache } from "@/lib/store/schoolCache";
import { getInitials, getLocalizedName, fixImageUrl } from "@/lib/utils";

const COLORS = ["#0D9488", "#7C3AED", "#EA580C", "#318B9B", "#059669", "#DC2626"];

export function TopSchools() {
  const { locale } = useUiStore();
  const cacheSchool = useSchoolCache((s) => s.set);
  const { data, isLoading } = useSchools({ per_page: 10 });
  const schools = data?.data ?? [];
  const ChevronIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          {locale === "ar" ? "المدارس الشريكة" : "Partner Schools"}
        </h2>
        <Link href="/schools" className="flex items-center gap-0.5 text-sm font-medium text-[#318B9B] hover:underline">
          {locale === "ar" ? "الكل" : "See all"}
          <ChevronIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[110px] h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse flex-shrink-0" />
            ))
          : schools.map((school, i) => {
              const color = COLORS[i % COLORS.length];
              const name = getLocalizedName(school.name, locale);
              return (
                <Link
                  key={school.id}
                  href={`/school/${school.id}`}
                  onClick={() => cacheSchool(school)}
                  className="group min-w-[108px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3 flex flex-col items-center gap-2 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0"
                    style={{ background: school.logo_url ? "transparent" : color + "18", color }}
                  >
                    {school.logo_url
                      ? <Image src={fixImageUrl(school.logo_url)} alt={name} width={44} height={44} className="w-full h-full object-contain" />
                      : <span className="text-sm font-bold">{getInitials(name)}</span>
                    }
                  </div>
                  <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 text-center line-clamp-2 leading-tight w-full">
                    {name}
                  </p>
                  {school.curriculum && (
                    <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">
                      {school.curriculum}
                    </span>
                  )}
                </Link>
              );
            })}
      </div>
    </div>
  );
}
