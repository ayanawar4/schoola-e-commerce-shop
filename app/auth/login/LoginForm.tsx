"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/lib/hooks/queries";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { getApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toaster";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function LoginForm() {
  const { locale } = useUiStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { login } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const loginMut = useLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = await loginMut.mutateAsync({ phone_country_code: "EG", phone, password });
      login(data.token, data.user);
      toast(locale === "ar" ? "تم تسجيل الدخول بنجاح" : "Logged in successfully", "success");
      router.push(redirect);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <AuthLayout
      title={{ ar: "تسجيل الدخول", en: "Log In" }}
      subtitle={{ ar: "أهلاً بعودتك في سكولا", en: "Welcome back to Schoola" }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="auth-label">{locale === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 rounded-2xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
              <Phone className="w-4 h-4" style={{ opacity: 0.5 }} /><span>+20</span>
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
            <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type={showPass ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
              className="auth-input" style={{ paddingInlineStart: 40, paddingInlineEnd: 40 }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute end-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }}>
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" disabled={loginMut.isPending} className="auth-btn-gold">
          {loginMut.isPending ? "..." : (locale === "ar" ? "تسجيل الدخول" : "Log In")}
        </button>
        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          {locale === "ar" ? "ليس لديك حساب؟" : "No account?"}{" "}
          <Link href="/auth/register" className="auth-link">{locale === "ar" ? "إنشاء حساب" : "Register"}</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
