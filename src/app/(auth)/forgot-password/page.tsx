"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Key, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/utils/validators";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const result = await forgotPassword(email);
      if (!result.success) {
        setStatus("error");
        setMessage(result.error || "Failed to send reset email.");
      } else {
        setStatus("success");
        setMessage("Recovery instructions have been sent. Please check your inbox.");
        setEmail("");
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
            Recover access to your celestial account
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
                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Check Your Email</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {message}
                </p>
              </div>
              <Button asChild variant="outline" className="w-full rounded-lg text-sm gap-2" style={{ borderColor: "rgba(212,175,55,0.3)", color: "var(--gold-light)" }}>
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                    <Mail className="w-4 h-4" />
                  </span>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <span>Requesting...</span>
                ) : (
                  <>
                    Send Recovery Email
                    <Key className="w-4 h-4" />
                  </>
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
