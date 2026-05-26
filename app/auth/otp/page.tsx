import { Suspense } from "react";
import OtpForm from "./OtpForm";

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#318B9B] border-t-transparent rounded-full animate-spin" /></div>}>
      <OtpForm />
    </Suspense>
  );
}
