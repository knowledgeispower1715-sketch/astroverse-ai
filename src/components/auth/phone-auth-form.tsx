"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, KeyRound, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendPhoneOtp, verifyPhoneOtp } from "@/app/(auth)/actions";

export function PhoneAuthForm() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "verifying" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 8) {
      setStatus("error");
      setErrorMessage("Please enter a valid phone number with country code (e.g. +91 9876543210).");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await sendPhoneOtp(cleanPhone);
      if (res.success) {
        setStep("otp");
        setStatus("idle");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Unable to send OTP. Ensure your phone number is valid and SMS provider is enabled.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("An unexpected error occurred sending OTP.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setStatus("error");
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setStatus("verifying");
    setErrorMessage("");

    try {
      const res = await verifyPhoneOtp(phone, otp.trim());
      if (res.success) {
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Invalid or expired verification code.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Failed to verify code. Please try again.");
    }
  };

  // Mask phone number for display (e.g. +91 ******3210)
  const maskPhone = (p: string) => {
    const clean = p.replace(/\s+/g, "");
    if (clean.length < 6) return clean;
    const prefix = clean.slice(0, 3);
    const suffix = clean.slice(-4);
    return `${prefix} ******${suffix}`;
  };

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold block text-white/70">Phone Number (with Country Code)</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={status === "sending"}
                className="h-12 pl-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50 text-sm font-mono"
              />
            </div>
          </div>

          {status === "error" && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === "sending"}
            className="w-full h-12 rounded-lg text-sm font-semibold gap-2 cursor-pointer"
            style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
          >
            {status === "sending" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Send Verification Code
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 flex items-center justify-between">
            <span>Code sent to <strong className="text-white font-mono">{maskPhone(phone)}</strong></span>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setStatus("idle");
              }}
              className="text-gold-light hover:underline text-[11px] font-semibold"
            >
              Change
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold block text-white/70">6-Digit Verification Code</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <Input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={status === "verifying" || status === "success"}
                className="h-12 pl-10 text-center tracking-widest text-lg font-mono bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
              />
            </div>
          </div>

          {status === "error" && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === "success" && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Identity verified! Launching cosmic session...</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={status === "verifying" || status === "success"}
            className="w-full h-12 rounded-lg text-sm font-semibold gap-2 cursor-pointer"
            style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
          >
            {status === "verifying" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Verifying OTP...
              </>
            ) : (
              <>
                Verify & Continue
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
