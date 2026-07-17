"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Lock, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/utils/validators";
import { signup } from "../actions";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setStatus("error");
      setMessage("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
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
      const result = await signup(email, password, name);
      if (!result.success) {
        setStatus("error");
        setMessage(result.error || "Failed to create account.");
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
            Begin your cosmic journey today
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Display Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "var(--text-muted)" }}>
                  <User className="w-4 h-4" />
                </span>
                <Input
                  type="text"
                  placeholder="Aria Moon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 pl-10 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                  disabled={status === "loading"}
                />
              </div>
            </div>

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
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>Password</label>
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
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Creating Account...</span>
              ) : (
                <>
                  Create Account
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-white/5">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--gold-light)" }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
