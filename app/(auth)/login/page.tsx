"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/utils/validators";
import { login } from "../actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setStatus("error");
      setMessage("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setStatus("error");
        setMessage(result.error || "Invalid credentials.");
      } else {
        router.push("/dashboard");
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
            Sign in to access your cosmic dashboard
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Password</label>
                <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: "var(--gold-light)" }}>
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                  <Lock className="w-4 h-4" />
                </span>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                  disabled={status === "loading"}
                />
              </div>
            </div>

            {/* Error Message */}
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
                <span>Signing In...</span>
              ) : (
                <>
                  Sign In
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-white/5">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--gold-light)" }}>
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
