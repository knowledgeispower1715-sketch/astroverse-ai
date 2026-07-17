"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on the homepage
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <nav className="flex items-center space-x-2 text-xs sm:text-sm font-medium py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors duration-200 hover:text-white"
            style={{ color: "var(--text-muted)" }}
          >
            <Home className="w-4.5 h-4.5" style={{ color: "var(--gold)" }} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          
          // Clean segment label (e.g. "birth-chart" -> "Birth Chart")
          // If segment is within parenthesis (e.g. "(auth)", "(app)") - but Next.js App Router ignores them in pathName, so split won't contain them
          const label = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <li key={segment} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              {isLast ? (
                <span className="text-gradient-gold select-none font-semibold">
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="transition-colors duration-200 hover:text-white"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
