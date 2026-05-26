"use client";
import { useRouter } from "next/navigation";
import { useUiStore } from "@/lib/store/ui";

interface Props {
  icon: string;
  color: string;
  messageAr: string;
  messageEn: string;
}

export function ComingSoon({ icon, color, messageAr, messageEn }: Props) {
  const { locale } = useUiStore();
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/85 backdrop-blur-sm cursor-pointer"
      onClick={() => router.push("/")}
    >
      {/* Card — clicks here don't bubble up */}
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl px-10 py-10 text-center max-w-xs w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-sm"
          style={{ background: color + "15", border: `1.5px solid ${color}25` }}
        >
          {icon}
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
          {locale === "ar" ? "قريباً" : "Coming Soon"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {locale === "ar" ? messageAr : messageEn}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: color }}
        >
          {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </button>
        <p className="text-xs text-gray-400 mt-3">
          {locale === "ar" ? "أو انقر في أي مكان للرجوع" : "or tap anywhere to go back"}
        </p>
      </div>
    </div>
  );
}
