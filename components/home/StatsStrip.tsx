"use client";
import { useSchools, useCatalog } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";

export function StatsStrip() {
  const { locale } = useUiStore();
  const { data: schoolsData } = useSchools({ per_page: 1 });
  const firstSchoolId = schoolsData?.data?.[0]?.id;
  const { data: catalogData } = useCatalog({ school_id: firstSchoolId, per_page: 1 });

  const stats = [
    { value: schoolsData?.meta?.total ?? "—", label: locale === "ar" ? "مدرسة شريكة" : "Schools" },
    { value: catalogData?.meta?.total ?? "—", label: locale === "ar" ? "منتج متاح" : "Products" },
    { value: locale === "ar" ? "١٠٠٪" : "100%", label: locale === "ar" ? "جودة مضمونة" : "Quality" },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {stats.map(({ value, label }, i) => (
        <div key={i} className={`flex flex-col items-center py-4 px-2 ${i === 0 ? (locale === "ar" ? "" : "") : ""}`}>
          <span className="text-xl font-extrabold text-[#318B9B]">{value}</span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 text-center leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}
