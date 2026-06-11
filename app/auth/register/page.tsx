"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/lib/hooks/queries";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { getApiError } from "@/lib/api/client";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const { locale } = useUiStore();
  const router = useRouter();
  const { setPendingPhone } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const registerMut = useRegister();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(locale === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    setError("");
    try {
      await registerMut.mutateAsync({
        phone_country_code: "EG",
        phone,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirmation: confirm,
      });
      setPendingPhone(phone, "EG");
      router.push("/auth/otp?flow=register");
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <AuthLayout
      title={{ ar: "إنشاء حساب", en: "Create Account" }}
      subtitle={{ ar: "أدخل بياناتك للبدء", en: "Enter your details to get started" }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="auth-label">{locale === "ar" ? "الاسم الأول" : "First Name"}</label>
            <input
              type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
              required className="auth-input"
              placeholder={locale === "ar" ? "أحمد" : "Ahmed"}
            />
          </div>
          <div className="flex-1">
            <label className="auth-label">{locale === "ar" ? "اسم العائلة" : "Last Name"}</label>
            <input
              type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
              required className="auth-input"
              placeholder={locale === "ar" ? "محمد" : "Mohamed"}
            />
          </div>
        </div>

        <div>
          <label className="auth-label">{locale === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
          <div className="flex gap-2">
            <div
              className="flex items-center gap-1.5 px-3 rounded-2xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: 14 }}
            >
              <Phone className="w-4 h-4" style={{ opacity: 0.5 }} />
              <span>+20</span>
            </div>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx" required className="auth-input flex-1" style={{ width: "auto" }}
            />
          </div>
        </div>

        <div>
          <label className="auth-label">{locale === "ar" ? "كلمة المرور" : "Password"}</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              required className="auth-input pe-10"
              placeholder="••••••••"
            />
            <button
              type="button" onClick={() => setShowPass(!showPass)}
              className="absolute end-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="auth-label">{locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</label>
          <input
            type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            required className="auth-input"
            placeholder="••••••••"
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" disabled={registerMut.isPending} className="auth-btn-gold">
          {registerMut.isPending
            ? (locale === "ar" ? "جاري الإرسال..." : "Sending...")
            : (locale === "ar" ? "إنشاء حساب" : "Create Account")}
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
