"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { salesQuotes } from "@/misc/quotes";

export default function Home() {
  const [quote, setQuote] = useState(salesQuotes[0]);

  useEffect(() => {
    const random = Math.floor(Math.random() * salesQuotes.length);
    setQuote(salesQuotes[random]);
  }, []);

  const links = [
    { href: "/form", label: "DDS Form" },
    { href: "/admin", label: "Admin Panel" },
    { href: "/report/employee", label: "Employee Report" },
    { href: "/report/exchange", label: "Exchange Report" },
    { href: "/network", label: "Network Insights" },
    { href: "#graph", label: "Graphical Visualizer (TBD)" }
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-900 p-8 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Welcome to Retail Sales Digital Portal</h1>
        <h2 className="text-xl font-light text-purple-200">KTR North [II & III]</h2>
      </div>

      <blockquote className="bg-white/10 p-4 rounded-lg border border-white/20 text-center max-w-xl mb-10">
        <p className="italic text-lg">“{quote.quote}”</p>
        <p className="text-sm text-purple-300 mt-2">— {quote.author}</p>
      </blockquote>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block w-full text-center p-4 bg-purple-600 rounded-lg hover:bg-purple-700 transition-all shadow-md"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
