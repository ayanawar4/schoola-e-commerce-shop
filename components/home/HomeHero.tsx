"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUiStore } from "@/lib/store/ui";
import { useAuthStore } from "@/lib/store/auth";

export function HomeHero() {
  const { locale } = useUiStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/uniforms?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ background: "linear-gradient(135deg, #0f2744 0%, #1a4a6b 45%, #145c6e 100%)" }}
    >
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      {/* Gold accent line top */}
      <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-3xl"
        style={{ background: "linear-gradient(90deg, transparent 0%, #C9A84C 50%, transparent 100%)" }} />

      <div className="relative z-10 px-6 pt-8 pb-7">
        {/* Greeting */}
        <p className="text-sm font-medium mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
          {user
            ? (locale === "ar" ? `أهلاً، ${user.first_name} 👋` : `Hello, ${user.first_name} 👋`)
            : (locale === "ar" ? "أهلاً بك في سكولا" : "Welcome to Schoola")}
        </p>

        {/* Headline */}
        <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-1">
          {locale === "ar" ? "كل ما يحتاجه طالبك" : "Everything your student needs"}
        </h1>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
          {locale === "ar" ? "أزياء مدرسية • أدوات • توصيل سريع" : "Uniforms • Supplies • Fast Delivery"}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "ar" ? "ابحث عن زي أو مدرسة..." : "Search uniforms or schools..."}
            className="w-full ps-11 pe-28 py-3.5 rounded-2xl text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <button
            type="submit"
            className="absolute end-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "#318B9B" }}
          >
            {locale === "ar" ? "بحث" : "Search"}
          </button>
        </form>
      </div>

      {/* Bottom quick links */}
      <div className="relative z-10 flex gap-2 px-6 pb-5 overflow-x-auto scrollbar-hide">
        {[
          { href: "/uniforms", label: locale === "ar" ? "🎽 الزي المدرسي" : "🎽 Uniforms" },
          { href: "/schools", label: locale === "ar" ? "🏫 المدارس" : "🏫 Schools" },
          { href: "/supplies", label: locale === "ar" ? "📚 الأدوات" : "📚 Supplies" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.08)" }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
