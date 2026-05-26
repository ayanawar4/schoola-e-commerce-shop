"use client";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, BookOpen, Pencil, Ruler, Backpack, Calculator } from "lucide-react";
import { useUiStore } from "@/lib/store/ui";

const floatingIcons = [
  { Icon: GraduationCap, size: 44, top: "5%",  left: "4%",  delay: "0s",   duration: "7s",   color: "#C9A84C", opacity: 0.30 },
  { Icon: BookOpen,      size: 36, top: "10%", left: "83%", delay: "1.5s", duration: "9s",   color: "#318B9B", opacity: 0.25 },
  { Icon: Pencil,        size: 32, top: "35%", left: "3%",  delay: "0.8s", duration: "8s",   color: "#ffffff", opacity: 0.18 },
  { Icon: Ruler,         size: 40, top: "55%", left: "90%", delay: "2.2s", duration: "10s",  color: "#C9A84C", opacity: 0.22 },
  { Icon: Backpack,      size: 48, top: "72%", left: "5%",  delay: "0.3s", duration: "8.5s", color: "#318B9B", opacity: 0.28 },
  { Icon: Calculator,    size: 34, top: "80%", left: "80%", delay: "1.8s", duration: "7.5s", color: "#ffffff", opacity: 0.18 },
  { Icon: BookOpen,      size: 30, top: "48%", left: "93%", delay: "3s",   duration: "9.5s", color: "#C9A84C", opacity: 0.20 },
  { Icon: GraduationCap, size: 28, top: "88%", left: "38%", delay: "1.2s", duration: "8s",   color: "#318B9B", opacity: 0.18 },
];

interface Props {
  children: React.ReactNode;
  title: { ar: string; en: string };
  subtitle: { ar: string; en: string };
}

export function AuthLayout({ children, title, subtitle }: Props) {
  const { locale, setLocale } = useUiStore();

  return (
    <>
      <style>{`
        @keyframes authBgShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes authFloatIcon {
          0%   { transform: translateY(0px) rotate(0deg); }
          33%  { transform: translateY(-12px) rotate(5deg); }
          66%  { transform: translateY(-5px) rotate(-3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes authOrbFloat {
          0%, 100% { transform: translate(30%, -30%) scale(1); opacity: 0.08; }
          50%       { transform: translate(27%, -33%) scale(1.1); opacity: 0.13; }
        }
        @keyframes authOrbFloat2 {
          0%, 100% { transform: translate(-30%, 30%) scale(1); opacity: 0.07; }
          50%       { transform: translate(-27%, 27%) scale(1.08); opacity: 0.11; }
        }
        .auth-fade-up { animation: authFadeUp 0.7s cubic-bezier(.22,.68,0,1.2) both; }
        .auth-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.07);
          color: #ffffff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.3); }
        .auth-input:focus { border-color: rgba(201,168,76,0.6); background: rgba(255,255,255,0.10); }
        .auth-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.55); margin-bottom: 6px; display: block; }
        .auth-btn-gold {
          width: 100%; padding: 14px; border-radius: 16px; font-weight: 700; font-size: 14px;
          background: linear-gradient(135deg, #C9A84C 0%, #e8c97a 50%, #b8922e 100%);
          color: #06101c; border: none; cursor: pointer;
          box-shadow: 0 6px 24px rgba(201,168,76,0.35);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          position: relative; overflow: hidden;
        }
        .auth-btn-gold:hover { transform: scale(1.02); box-shadow: 0 10px 36px rgba(201,168,76,0.45); }
        .auth-btn-gold:active { transform: scale(0.97); }
        .auth-btn-gold:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .auth-error {
          padding: 10px 14px; border-radius: 12px;
          background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5; font-size: 13px;
        }
        .auth-link { color: #C9A84C; font-weight: 600; text-decoration: none; transition: opacity 0.2s; }
        .auth-link:hover { opacity: 0.75; text-decoration: underline; }
      `}</style>

      <div style={{ colorScheme: "dark" }}>
        <div
          className="min-h-screen flex flex-col relative overflow-hidden"
          style={{
            background: "linear-gradient(-45deg, #06101c, #0b1f33, #091e2a, #0c2416, #0a1628, #0e1e38)",
            backgroundSize: "400% 400%",
            animation: "authBgShift 16s ease infinite",
          }}
        >
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Orbs */}
          <div className="absolute top-0 end-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, #C9A84C, transparent 65%)", animation: "authOrbFloat 10s ease-in-out infinite" }} />
          <div className="absolute bottom-0 start-0 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, #318B9B, transparent 65%)", animation: "authOrbFloat2 13s ease-in-out infinite" }} />

          {/* Floating icons */}
          {floatingIcons.map(({ Icon, size, top, left, delay, duration, color, opacity }, i) => (
            <div key={i} className="absolute pointer-events-none"
              style={{ top, left, opacity, animation: `authFloatIcon ${duration} ease-in-out ${delay} infinite`, filter: `drop-shadow(0 0 6px ${color}70)` }}>
              <Icon style={{ width: size, height: size, color }} />
            </div>
          ))}

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-5">
            <Link href="/" className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.45)" }}>
              ← {locale === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <button onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(201,168,76,0.35)", color: "rgba(201,168,76,0.85)" }}>
              {locale === "ar" ? "English" : "عربي"}
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8">

            {/* Logo */}
            <div className="mb-6 auth-fade-up" style={{ animationDelay: "0.1s" }}>
              <Image
                src="/assets/images/schoola-logo-egypt-dark-transparent.svg"
                alt="Schoola"
                width={220}
                height={90}
                className="w-48 md:w-56 mx-auto"
                style={{ height: "auto" }}
                priority
              />
            </div>

            {/* Gold divider */}
            <div className="flex items-center gap-3 mb-5 w-full max-w-[240px] auth-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5))" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }} />
              <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.5), transparent)" }} />
            </div>

            {/* Title */}
            <div className="text-center mb-6 auth-fade-up" style={{ animationDelay: "0.25s" }}>
              <h1 className="text-2xl font-extrabold text-white mb-1">{title[locale]}</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{subtitle[locale]}</p>
            </div>

            {/* Form card */}
            <div
              className="w-full max-w-sm rounded-3xl p-6 auth-fade-up"
              style={{
                animationDelay: "0.35s",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              }}
            >
              {children}
            </div>
          </div>

          {/* Bottom line */}
          <div className="absolute bottom-0 inset-x-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent)" }} />
        </div>
      </div>
    </>
  );
}
