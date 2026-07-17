"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updatePassword } from "../actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      setStatus("error");
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const result = await updatePassword(password);
      if (!result.success) {
        setStatus("error");
        setMessage(result.error || "Failed to update password.");
      } else {
        setStatus("success");
        setMessage("Password updated successfully! Redirecting you to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 60%)" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-7 h-7" style={{ color: "var(--gold)" }} />
            <span className="text-2xl font-bold text-gradient-gold" style={{ fontFamily: "var(--font-outfit)" }}>
              AstroVerse AI
            </span>
          </Link>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Define your new credentials
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-white/5 shadow-2xl">
          {status === "success" ? (
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e" }}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Password Reset Success</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {message}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                    <Lock className="w-4 h-4" />
                  </span>
                  <Input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                    <Lock className="w-4 h-4" />
                  </span>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {/* Status Message */}
              {status === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 rounded-lg text-sm font-semibold gap-2 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {status === "loading" ? (
                  <span>Updating...</span>
                ) : (
                  <span>Reset Password</span>
                )}
              </Button>

              <div className="text-center pt-4">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs hover:underline" style={{ color: "var(--text-muted)" }}>
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
