"use client";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Shirt, Zap, BookOpen, Pencil, Ruler, Backpack, Calculator } from "lucide-react";
import { useUiStore } from "@/lib/store/ui";

const features = [
  {
    icon: GraduationCap,
    color: "#318B9B",
    bg: "rgba(49,139,155,0.12)",
    border: "rgba(49,139,155,0.25)",
    title: { ar: "كل المدارس", en: "All Schools" },
    desc: { ar: "أزياء رسمية لجميع المدارس", en: "Uniforms for every school" },
  },
  {
    icon: Shirt,
    color: "#C9A84C",
    bg: "rgba(201,168,76,0.12)",
    border: "rgba(201,168,76,0.3)",
    title: { ar: "جودة مضمونة", en: "Top Quality" },
    desc: { ar: "منتجات معتمدة بأعلى معايير", en: "Certified premium products" },
  },
  {
    icon: Zap,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.12)",
    border: "rgba(124,58,237,0.25)",
    title: { ar: "طلب سريع", en: "Fast Order" },
    desc: { ar: "اطلب وتتبع في لحظات", en: "Order & track instantly" },
  },
];

// Floating school icons scattered in background
const floatingIcons = [
  { Icon: GraduationCap, size: 48, top: "6%",  left: "5%",  delay: "0s",    duration: "7s",  color: "#C9A84C", opacity: 0.35 },
  { Icon: BookOpen,      size: 40, top: "12%", left: "85%", delay: "1.5s",  duration: "9s",  color: "#318B9B", opacity: 0.30 },
  { Icon: Pencil,        size: 36, top: "32%", left: "3%",  delay: "0.8s",  duration: "8s",  color: "#ffffff", opacity: 0.22 },
  { Icon: Ruler,         size: 44, top: "52%", left: "90%", delay: "2.2s",  duration: "10s", color: "#C9A84C", opacity: 0.28 },
  { Icon: Backpack,      size: 52, top: "68%", left: "5%",  delay: "0.3s",  duration: "8.5s",color: "#318B9B", opacity: 0.32 },
  { Icon: Calculator,    size: 38, top: "80%", left: "82%", delay: "1.8s",  duration: "7.5s",color: "#ffffff", opacity: 0.20 },
  { Icon: BookOpen,      size: 34, top: "44%", left: "94%", delay: "3s",    duration: "9.5s",color: "#C9A84C", opacity: 0.25 },
  { Icon: Pencil,        size: 40, top: "88%", left: "38%", delay: "1.2s",  duration: "8s",  color: "#318B9B", opacity: 0.22 },
  { Icon: GraduationCap, size: 36, top: "20%", left: "48%", delay: "2.8s",  duration: "11s", color: "#ffffff", opacity: 0.18 },
  { Icon: Ruler,         size: 32, top: "62%", left: "28%", delay: "0.5s",  duration: "9s",  color: "#C9A84C", opacity: 0.24 },
];

export function LandingPage() {
  const { locale, setLocale } = useUiStore();

  return (
    <>
      <style>{`
        @keyframes bgShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatIcon {
          0%   { transform: translateY(0px) rotate(0deg);   opacity: var(--op); }
          33%  { transform: translateY(-14px) rotate(6deg); opacity: calc(var(--op) * 1.4); }
          66%  { transform: translateY(-6px) rotate(-4deg); opacity: var(--op); }
          100% { transform: translateY(0px) rotate(0deg);   opacity: var(--op); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scalePop {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(30%, -30%) scale(1);    opacity: 0.08; }
          50%       { transform: translate(27%, -33%) scale(1.1);  opacity: 0.12; }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(-30%, 30%) scale(1);   opacity: 0.07; }
          50%       { transform: translate(-27%, 27%) scale(1.08);opacity: 0.11; }
        }
        @keyframes dividerExpand {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes cardWave {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }

        .anim-fade-up   { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-fade-in   { animation: fadeIn 0.6s ease both; }
        .anim-scale-pop { animation: scalePop 0.8s cubic-bezier(.22,.68,0,1.2) both; }
        .anim-float     { animation: float 5s ease-in-out infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #C9A84C 0%, #f5e199 40%, #C9A84C 60%, #b8922e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }

        .glow-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .glow-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.55s;
        }
        .glow-btn:hover::after { transform: translateX(100%); }
        .glow-btn:hover { transform: scale(1.03); box-shadow: 0 14px 44px rgba(201,168,76,0.45); }
        .glow-btn:active { transform: scale(0.97); }

        .ghost-btn { transition: background 0.2s, transform 0.2s; }
        .ghost-btn:hover { background: rgba(255,255,255,0.07); transform: scale(1.02); }
        .ghost-btn:active { transform: scale(0.97); }

        .feature-card {
          transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 10px 32px rgba(0,0,0,0.35);
        }
      `}</style>

      {/* Force this page to always use its own colors regardless of dark mode */}
      <div className="light" style={{ colorScheme: "light" }}>
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{
          background: "linear-gradient(-45deg, #06101c, #0b1f33, #091e2a, #0c2416, #0a1628, #0e1e38)",
          backgroundSize: "400% 400%",
          animation: "bgShift 16s ease infinite",
        }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Animated glow orbs */}
        <div className="absolute top-0 end-0 w-[550px] h-[550px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent 65%)", animation: "orbFloat 10s ease-in-out infinite" }} />
        <div className="absolute bottom-0 start-0 w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #318B9B, transparent 65%)", animation: "orbFloat2 13s ease-in-out infinite" }} />

        {/* Floating school icons */}
        {floatingIcons.map(({ Icon, size, top, left, delay, duration, color, opacity }, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top, left,
              ["--op" as any]: opacity,
              animation: `floatIcon ${duration} ease-in-out ${delay} infinite`,
              opacity,
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
          >
            <Icon style={{ width: size, height: size, color }} />
          </div>
        ))}

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-end px-6 pt-6 anim-fade-in" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="text-xs font-semibold px-4 py-1.5 rounded-full border transition-all hover:bg-white/5"
            style={{ borderColor: "rgba(201,168,76,0.35)", color: "rgba(201,168,76,0.85)" }}
          >
            {locale === "ar" ? "English" : "عربي"}
          </button>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-10 text-center">

          {/* Logo */}
          <div className="relative mb-6 anim-scale-pop" style={{ animationDelay: "0.15s" }}>
            <div className="anim-float">
              <Image
                src="/assets/images/schoola-logo-egypt-dark-transparent.svg"
                alt="Schoola"
                width={300}
                height={123}
                className="w-64 md:w-[300px] mx-auto drop-shadow-2xl"
                style={{ height: "auto" }}
                priority
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6 w-full max-w-[260px]" style={{ animation: "dividerExpand 0.9s ease 0.55s both" }}>
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.6))" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 8px #C9A84C" }} />
            <div className="w-1 h-1 rounded-full" style={{ background: "rgba(201,168,76,0.4)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 8px #C9A84C" }} />
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.6), transparent)" }} />
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3 text-white max-w-sm anim-fade-up" style={{ animationDelay: "0.45s" }}>
            {locale === "ar" ? (
              <>كل ما يحتاجه <span className="shimmer-text">طالبك</span></>
            ) : (
              <>Everything your <span className="shimmer-text">student</span> needs</>
            )}
          </h1>

          <p className="text-sm max-w-[260px] mx-auto mb-8 leading-relaxed anim-fade-up"
            style={{ color: "rgba(255,255,255,0.45)", animationDelay: "0.55s" }}>
            {locale === "ar"
              ? "المنصة الأولى للزي المدرسي الرسمي والأدوات الدراسية في مصر"
              : "Egypt's #1 platform for official school uniforms & supplies"}
          </p>

          {/* Feature cards with staggered wave */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm mb-9">
            {features.map(({ icon: Icon, color, bg, border, title, desc }, i) => (
              <div
                key={title.en}
                className="feature-card rounded-2xl p-3 flex flex-col items-center gap-2 text-center border anim-fade-up"
                style={{
                  background: bg,
                  borderColor: border,
                  animationDelay: `${0.65 + i * 0.12}s`,
                  animation: `fadeUp 0.75s cubic-bezier(.22,.68,0,1.2) ${0.65 + i * 0.12}s both, cardWave ${5 + i * 1.2}s ease-in-out ${i * 0.8}s infinite`,
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}22`, border: `1px solid ${color}35` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="text-[11px] font-bold text-white leading-tight">{title[locale]}</p>
                <p className="text-[9px] leading-snug" style={{ color: "rgba(255,255,255,0.38)" }}>{desc[locale]}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 w-full max-w-[280px] anim-fade-up" style={{ animationDelay: "0.95s" }}>
            <Link
              href="/auth/login"
              className="glow-btn w-full py-4 rounded-2xl font-bold text-sm text-center"
              style={{
                background: "linear-gradient(135deg, #C9A84C 0%, #e8c97a 50%, #b8922e 100%)",
                backgroundSize: "200% auto",
                color: "#06101c",
                boxShadow: "0 6px 28px rgba(201,168,76,0.35)",
              }}
            >
              {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
            </Link>

            <Link
              href="/auth/register"
              className="ghost-btn w-full py-4 rounded-2xl font-bold text-sm text-center border"
              style={{ borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.85)" }}
            >
              {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
            </Link>

          </div>
        </div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 inset-x-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </div>
      </div>
    </>
  );
}
