"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/utils/validators";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're now aligned with the stars!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section className="relative py-20 sm:py-24 lg:py-32" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl p-8 sm:p-12 text-center overflow-hidden gradient-border"
          style={{ background: "var(--bg-card)" }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)" }} />

          <div className="relative z-10">
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gradient-gold"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Stay Aligned with the Stars
            </h2>
            <p className="text-sm sm:text-base mb-8" style={{ color: "var(--text-secondary)" }}>
              Get weekly cosmic insights, transit alerts, and exclusive content delivered to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                className="h-12 rounded-full px-5 text-sm flex-1"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(212, 175, 55, 0.2)",
                  color: "var(--text-primary)",
                }}
                disabled={status === "loading"}
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="h-12 rounded-full px-6 text-sm font-semibold gap-2"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {status === "loading" ? (
                  <span className="animate-pulse">Subscribing...</span>
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Status messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-4 text-sm"
                style={{ color: "#22c55e" }}
              >
                <CheckCircle2 className="w-4 h-4" />
                {message}
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mt-4 text-sm"
                style={{ color: "#ef4444" }}
              >
                <AlertCircle className="w-4 h-4" />
                {message}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
