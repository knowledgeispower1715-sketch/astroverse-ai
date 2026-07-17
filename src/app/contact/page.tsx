"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Phone } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/utils/validators";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setStatus("error");
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    // Simulate API request
    setTimeout(() => {
      setStatus("success");
      setStatusMessage("Message sent successfully! Our cosmic support team will respond shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gradient-gold mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Connect With Us
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Have a question about your charts or subscription? Send us a message and we&apos;ll reply as soon as the stars align.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Info Columns */}
          <div className="space-y-6 sm:col-span-1">
            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Support Email</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>support@astroverse.ai</p>
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Cosmic Helpline</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>+1 (800) 555-ASTRO</p>
              </div>
            </div>

            <div className="glass rounded-xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(212, 175, 55, 0.1)", color: "var(--gold)" }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Headquarters</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Nebula Tower, Suite 404, San Francisco, CA</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Your Name *</label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                    disabled={status === "loading"}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Your Email *</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Subject</label>
                <Input
                  type="text"
                  placeholder="Subject of inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-lg focus:border-gold/50"
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Message *</label>
                <textarea
                  placeholder="Write your message here..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                  disabled={status === "loading"}
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto h-12 rounded-lg px-8 text-sm font-semibold gap-2 cursor-pointer"
                style={{ background: "var(--gradient-gold)", color: "var(--bg-primary)" }}
              >
                {status === "loading" ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>

              {/* Status Display */}
              {status === "success" && (
                <div className="flex items-center gap-2 text-sm mt-4 text-green-500 font-medium bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-sm mt-4 text-red-500 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
