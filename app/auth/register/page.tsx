"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone } from "lucide-react";
import { useRequestOtp } from "@/lib/hooks/queries";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { getApiError } from "@/lib/api/client";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const { locale } = useUiStore();
  const router = useRouter();
  const { setPendingPhone } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const requestMut = useRequestOtp();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await requestMut.mutateAsync({ phone_country_code: "EG", phone });
      setPendingPhone(phone, "EG");
      router.push("/auth/otp?flow=register");
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <AuthLayout
      title={{ ar: "إنشاء حساب", en: "Create Account" }}
      subtitle={{ ar: "أدخل رقم هاتفك للبدء", en: "Enter your phone number to get started" }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="auth-label">{locale === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 rounded-2xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
              <Phone className="w-4 h-4" style={{ opacity: 0.5 }} />
              <span>+20</span>
            </div>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx" required className="auth-input flex-1" style={{ width: "auto" }}
            />
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={requestMut.isPending} className="auth-btn-gold">
          {requestMut.isPending
            ? (locale === "ar" ? "جاري الإرسال..." : "Sending...")
            : (locale === "ar" ? "إرسال رمز التحقق" : "Send OTP")}
        </button>

        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          {locale === "ar" ? "لديك حساب؟" : "Already have an account?"}{" "}
          <Link href="/auth/login" className="auth-link">
            {locale === "ar" ? "تسجيل الدخول" : "Log In"}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
