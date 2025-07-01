"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { salesQuotes } from "@/misc/quotes";
import { usePermission } from "@/hooks/usePermission";

interface linkButton {
  href: string;
  label: string;
  level?: number;
  disabled?: boolean;
}

export default function Home() {
  const [quote, setQuote] = useState(salesQuotes[0]);
  const { isLoggedIn, name, level } = usePermission();

  useEffect(() => {
    const random = Math.floor(Math.random() * salesQuotes.length);
    setQuote(salesQuotes[random]);
  }, []);

  const links: linkButton[] = [
    { href: "/form", label: "DDS Form" },
    { href: "/report/employee", label: "Employee Report", level: 1 },
    { href: "/report/exchange", label: "Exchange Report", level: 1 },
    { href: "/report/efficiency", label: "Efficiency Report", level: 1 },
    { href: "/network", label: "Network Insights", level: 2 },
    { href: "/admin", label: "Admin Panel", level: 3 },
    { href: "#", label: "Distributor-Referral Leads", disabled: true },
    { href: "#", label: "Graphical Visualizer", disabled: true },
    { href: "#", label: "Customer Verfication", disabled: true },
    { href: "#", label: "Competitor Analysis", disabled: true }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-900 p-8 text-white relative">
      {/* Header Bar */}
      <div className="absolute top-4 right-6 text-sm flex gap-3 items-center">
        {isLoggedIn ? (
          <span className="bg-white/10 px-4 py-2 rounded-full text-purple-100">
            Welcome, <strong>{name}</strong>
          </span>
        ) : (
          <Link
            href="/login"
            className="bg-white/10 px-4 py-2 rounded-full text-purple-100 hover:bg-white/20 transition"
          >
            Login
          </Link>
        )}
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome to Retail Sales Digital Portal</h1>
        <h2 className="text-xl font-light text-purple-200">KTR North [II & III]</h2>
      </div>

      <blockquote className="bg-white/10 p-4 rounded-lg border border-white/20 text-center max-w-xl mb-10">
        <p className="italic text-lg">“{quote.quote}”</p>
        <p className="text-sm text-purple-300 mt-2">— {quote.author}</p>
      </blockquote>

      <Link
        href="/gallery"
        className="mb-8 px-6 py-3 bg-green-600 rounded-full text-lg font-semibold hover:bg-green-700 transition-all shadow-lg"
      >
        PTCL Packages
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {links.map((link) => {
          const levelTooLow = link.level !== undefined && level < link.level;
          const isDisabled = link.disabled || levelTooLow;

          return (
            <div
              key={link.label}
              className={`block w-full text-center p-4 rounded-lg transition-all shadow-md ${
                isDisabled
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isDisabled ? (
                <span>
                  {link.label} {levelTooLow ? "🔒" : ""}
                </span>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
