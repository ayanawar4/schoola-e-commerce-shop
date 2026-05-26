"use client";
import Link from "next/link";
import { useUiStore } from "@/lib/store/ui";
import { Tag } from "lucide-react";

export function PromoBanner() {
  const { locale } = useUiStore();

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 flex items-center justify-between gap-4"
      style={{ background: "linear-gradient(135deg, #318B9B 0%, #1a5f6b 100%)" }}
    >
      {/* Circle decorations */}
      <div className="absolute -top-6 -end-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-4 -start-4 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="w-3.5 h-3.5 text-yellow-300" />
          <span className="text-xs font-semibold text-yellow-300">
            {locale === "ar" ? "عرض محدود" : "Limited Offer"}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-white leading-tight">
          {locale === "ar" ? "العودة للمدارس ٢٠٢٦" : "Back to School 2026"}
        </h3>
        <p className="text-xs text-white/70 mt-0.5">
          {locale === "ar" ? "جهّز طالبك بأفضل الأسعار" : "Gear up your student at the best prices"}
        </p>
      </div>

      <Link
        href="/uniforms"
        className="relative z-10 flex-shrink-0 px-5 py-2.5 rounded-xl bg-white font-bold text-sm transition-all hover:bg-gray-50 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
        style={{ color: "#318B9B" }}
      >
        {locale === "ar" ? "تسوق الآن" : "Shop Now"}
      </Link>
    </div>
  );
}
