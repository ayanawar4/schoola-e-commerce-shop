"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyOtp, useRequestOtp, useVerifyRegister, useResendRegisterOtp } from "@/lib/hooks/queries";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { getApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toaster";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function OtpForm() {
  const { locale } = useUiStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pendingPhone, pendingCountryCode, clearPendingPhone, login } = useAuthStore();
  const flow = searchParams.get("flow");
  const isRegisterFlow = flow === "register";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyOtpMut = useVerifyOtp();
  const requestOtpMut = useRequestOtp();
  const verifyRegisterMut = useVerifyRegister();
  const resendRegisterMut = useResendRegisterOtp();

  const verifyMut = isRegisterFlow ? verifyRegisterMut : verifyOtpMut;
  const requestMut = isRegisterFlow ? resendRegisterMut : requestOtpMut;

  useEffect(() => {
    if (!pendingPhone) router.push("/auth/login");
  }, [pendingPhone, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== "")) handleSubmit(next.join(""));
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  async function handleSubmit(code: string) {
    if (!pendingPhone || !pendingCountryCode) return;
    setError("");
    try {
      if (isRegisterFlow) {
        const data = await verifyRegisterMut.mutateAsync({ phone_country_code: pendingCountryCode, phone: pendingPhone, code });
        clearPendingPhone();
        login(data.token, data.user);
        toast(locale === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully", "success");
        router.push("/");
      } else {
        await verifyOtpMut.mutateAsync({ phone_country_code: pendingCountryCode, phone: pendingPhone, code });
        clearPendingPhone();
        router.push("/auth/complete-profile");
      }
    } catch (err) {
      setError(getApiError(err));
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  }

  async function handleResend() {
    if (!pendingPhone || !pendingCountryCode || countdown > 0) return;
    try {
      await requestMut.mutateAsync({ phone_country_code: pendingCountryCode, phone: pendingPhone });
      setCountdown(60);
      toast(locale === "ar" ? "تم إعادة إرسال الرمز" : "OTP resent", "success");
    } catch (err) {
      toast(getApiError(err), "error");
    }
  }

  return (
    <AuthLayout
      title={{ ar: "التحقق من الرمز", en: "Verify OTP" }}
      subtitle={{
        ar: `تم إرسال الرمز إلى +20${pendingPhone}`,
        en: `Code sent to +20${pendingPhone}`,
      }}
    >
      <div className="space-y-6">
        <div className="flex gap-3 justify-center" dir="ltr">
          {otp.map((digit, i) => (
            <input
              key={i} ref={(el) => { inputRefs.current[i] = el; }}
              type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleInput(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-2xl outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "2px solid rgba(255,255,255,0.12)",
                color: "#ffffff",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = digit ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.12)"; }}
            />
          ))}
        </div>
        {error && <div className="auth-error text-center">{error}</div>}
        {verifyMut.isPending && (
          <div className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {locale === "ar" ? "جاري التحقق..." : "Verifying..."}
          </div>
        )}
        <div className="text-center text-sm">
          {countdown > 0
            ? <span style={{ color: "rgba(255,255,255,0.35)" }}>{locale === "ar" ? `إعادة الإرسال بعد ${countdown}ث` : `Resend in ${countdown}s`}</span>
            : <button onClick={handleResend} disabled={requestMut.isPending} className="auth-link disabled:opacity-60">
                {locale === "ar" ? "إعادة إرسال الرمز" : "Resend OTP"}
              </button>
          }
        </div>
      </div>
    </AuthLayout>
  );
}
