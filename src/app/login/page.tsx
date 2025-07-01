"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [epi, setEpi] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ epi, password }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    if (res.ok) {
      router.replace("/");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white">
      <div className="bg-gray-800 shadow-xl p-6 rounded-xl w-full max-w-sm border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-white">Login</h1>
        <input
          type="text"
          placeholder="EPI"
          value={epi}
          onChange={(e) => setEpi(e.target.value)}
          className="bg-gray-700 border border-gray-600 placeholder-gray-400 text-white p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-700 border border-gray-600 placeholder-gray-400 text-white p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleLogin}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 w-full rounded transition-all"
        >
          Login
        </button>
        {error && <p className="text-red-400 mt-3">{error}</p>}
      </div>
    </div>
  );
}
