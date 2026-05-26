"use client";
import Link from "next/link";
import { GraduationCap, Shirt, Store, BookOpen } from "lucide-react";
import { useUiStore } from "@/lib/store/ui";

const categories = [
  { key: "schools",  href: "/schools",  color: "#0D9488", bg: "#f0fdfa", darkBg: "#0d2e2a", icon: GraduationCap, label: { ar: "المدارس",     en: "Schools"   }, desc: { ar: "٢٠+ مدرسة",   en: "20+ schools"  } },
  { key: "uniforms", href: "/uniforms", color: "#318B9B", bg: "#f0f9ff", darkBg: "#0d2535", icon: Shirt,          label: { ar: "الأزياء",     en: "Uniforms"  }, desc: { ar: "للجميع",       en: "All grades"   } },
  { key: "supplies", href: "/supplies", color: "#7C3AED", bg: "#faf5ff", darkBg: "#1e1035", icon: BookOpen,       label: { ar: "الأدوات",     en: "Supplies"  }, desc: { ar: "أدوات مدرسية", en: "School gear"  } },
  { key: "stores",   href: "/stores",   color: "#EA580C", bg: "#fff7ed", darkBg: "#2d1505", icon: Store,          label: { ar: "المتاجر",     en: "Stores"    }, desc: { ar: "فروعنا",        en: "Locations"    } },
];

export function CategoryGrid() {
  const { locale, darkMode } = useUiStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          {locale === "ar" ? "تصفح الأقسام" : "Browse Categories"}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const bg = darkMode ? cat.darkBg : cat.bg;
          return (
            <Link
              key={cat.key}
              href={cat.href}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl text-center transition-all hover:scale-[1.04] active:scale-[0.97]"
              style={{ background: bg }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: cat.color + "18", border: `1.5px solid ${cat.color}25` }}
              >
                <Icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  {cat.label[locale]}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
                  {cat.desc[locale]}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
