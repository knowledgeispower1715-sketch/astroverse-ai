"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Shield, Users, Database, FileText, ArrowLeft, User } from "lucide-react";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { AnimatedCard } from "@/components/shared/animated-card";
import { createClient } from "@/lib/supabase/client";

const MOCK_METRICS = [
  { label: "Total Registered Seekers", value: "1,248", icon: Users, color: "text-gold" },
  { label: "Calculations Processed", value: "14,890", icon: Database, color: "text-purple-light" },
  { label: "System Health Status", value: "Optimal", icon: Shield, color: "text-green-400" },
];

const MOCK_USERS_LIST = [
  { email: "aria.nightshade@astroverse.ai", role: "admin", name: "Aria Nightshade", created: "Jul 01, 2026" },
  { email: "marcus.chen@example.com", role: "user", name: "Marcus Chen", created: "Jul 10, 2026" },
  { email: "luna.silveira@example.com", role: "user", name: "Luna Silveira", created: "Jul 12, 2026" },
];

export default function AdminPage() {
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.name || user.email?.split("@")[0] || "Admin";
          setAdminName(name);
        }
      } catch (err) {
        console.error("Error retrieving admin details:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gradient-gold mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
              Admin Console
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Welcome, {loading ? "..." : adminName}. Manage the system configuration, users database, and reports metrics.
            </p>
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs hover:underline" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {MOCK_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <AnimatedCard key={metric.label} delay={idx * 0.05} className="p-6 border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/5">
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold block" style={{ color: "var(--text-muted)" }}>{metric.label}</span>
                  <span className="text-xl font-bold text-white mt-1 block">{metric.value}</span>
                </div>
              </AnimatedCard>
            );
          })}
        </div>

        {/* Users Table */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>Seeker Accounts List</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10" style={{ color: "var(--text-muted)" }}>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Role Status</th>
                  <th className="pb-3">Registered Date</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--text-secondary)" }}>
                {MOCK_USERS_LIST.map((seeker) => (
                  <tr key={seeker.email} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-gold/60" />
                      <span>{seeker.name}</span>
                    </td>
                    <td className="py-3">{seeker.email}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        seeker.role === "admin" ? "bg-purple-500/10 text-purple-300 border border-purple-500/20" : "bg-white/5 text-white/70 border border-white/10"
                      }`}>
                        {seeker.role}
                      </span>
                    </td>
                    <td className="py-3">{seeker.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
