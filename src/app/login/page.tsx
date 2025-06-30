"use client";

import Cookies from "js-cookie";
import { useState } from "react";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");

  const requestCode = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/request-code", {
      body: JSON.stringify({ email }),
      method: "POST"
    });

    const data = await res.json();
    if (res.ok) {
      setStep("code");
      setMessage("Code sent to your email");
    } else {
      setMessage(data.error || "Something went wrong");
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    const res = await fetch("/api/auth/verify-code", {
      body: JSON.stringify({ code }),
      method: "POST"
    });

    const data = await res.json();
    if (res.ok) {
      Cookies.set("permission", JSON.stringify(data.permission), { expires: 7 });
      setMessage("Login successful!");
      window.location.href = "/";
    } else {
      setMessage(data.error || "Invalid code");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 text-white">
        <h2 className="text-center text-3xl font-bold">
          {step === "email" ? "Login with Email" : "Enter Code"}
        </h2>

        {message && <p className="text-center text-sm text-gray-400">{message}</p>}

        {step === "email" ? (
          <div className="space-y-4">
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-800 border border-gray-600"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={requestCode}
              disabled={loading}
              className="w-full py-3 rounded bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-800 border border-gray-600"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={verifyCode}
              disabled={loading}
              className="w-full py-3 rounded bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90 transition"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
