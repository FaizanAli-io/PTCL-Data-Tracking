"use client";

import Link from "next/link";

export default function Home() {
  const links = [
    { href: "/form", label: "Fill Form" },
    { href: "/report", label: "View Report" },
    { href: "/network", label: "View Network" }
  ];

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-white">FSA / TSA Portal</h1>
      <div className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block w-full text-center p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
