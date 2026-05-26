"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "@/lib/hooks/queries";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { getApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { score: 0, label: "Weak", color: "bg-red-400" },
    { score: 1, label: "Weak", color: "bg-red-400" },
    { score: 2, label: "Fair", color: "bg-orange-400" },
    { score: 3, label: "Good", color: "bg-yellow-400" },
    { score: 4, label: "Strong", color: "bg-green-500" },
  ];
  return levels[score];
}

export default function CompleteProfilePage() {
  const { locale } = useUiStore();
  const router = useRouter();
  const { pendingPhone, pendingCountryCode, login } = useAuthStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const registerMut = useRegister();
  const strength = getStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError(locale === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"); return; }
    if (!pendingPhone || !pendingCountryCode) { router.push("/auth/register"); return; }
    setError("");
    try {
      const data = await registerMut.mutateAsync({
        phone_country_code: pendingCountryCode,
        phone: pendingPhone,
        first_name: firstName,
        last_name: lastName,
        email: email || undefined,
        password,
        password_confirmation: confirm,
      });
      login(data.token, data.user);
      toast(locale === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully", "success");
      router.push("/");
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold" style={{ background: "#318B9B" }}>SC</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{locale === "ar" ? "إكمال الملف الشخصي" : "Complete Profile"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{locale === "ar" ? "الاسم الأول" : "First Name"} *</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{locale === "ar" ? "اسم العائلة" : "Last Name"} *</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{locale === "ar" ? "البريد الإلكتروني (اختياري)" : "Email (optional)"}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{locale === "ar" ? "كلمة المرور" : "Password"} *</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="w-full pe-10 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff className="w-4 h-4" /></button>
            </div>
            <div className="mt-2 space-y-1">
              {password && (
                <>
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength.score ? strength.color : "bg-gray-200 dark:bg-gray-700")} />)}
                  </div>
                  <p className="text-xs text-gray-400">{strength.label}</p>
                </>
              )}
              <ul className="mt-1 space-y-0.5">
                {[
                  { check: password.length >= 8, label: locale === "ar" ? "8 أحرف على الأقل" : "At least 8 characters" },
                  { check: /[A-Z]/.test(password), label: locale === "ar" ? "حرف كبير واحد على الأقل" : "At least 1 uppercase letter" },
                  { check: /[0-9]/.test(password), label: locale === "ar" ? "رقم واحد على الأقل" : "At least 1 number" },
                  { check: /[^A-Za-z0-9]/.test(password), label: locale === "ar" ? "رمز خاص واحد على الأقل (مثل @)" : "At least 1 special character (e.g. @)" },
                ].map(({ check, label }) => (
                  <li key={label} className={cn("flex items-center gap-1.5 text-xs transition-colors", check ? "text-green-500" : "text-gray-400")}>
                    <span>{check ? "✓" : "○"}</span>{label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">{locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"} *</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className={cn("w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]", confirm && confirm !== password ? "border-red-400" : "border-gray-200 dark:border-gray-700")} />
          </div>

          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>}

          <button type="submit" disabled={registerMut.isPending} className="w-full bg-[#318B9B] text-white font-bold py-3.5 rounded-2xl hover:bg-[#1a5f6b] disabled:opacity-60 transition-colors active:scale-95">
            {registerMut.isPending ? "..." : (locale === "ar" ? "إنشاء الحساب" : "Create Account")}
          </button>
        </form>
      </div>
    </div>
  );
}
