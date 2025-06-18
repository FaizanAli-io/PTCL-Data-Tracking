"use client";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [shake, setShake] = useState(false);
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleSubmit = () => {
    if (password === correctPassword) {
      setAuthorized(true);
    } else {
      setShake(true);
      setPassword("");
      toast.error("Incorrect password");
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!authorized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
        <div
          className={clsx("bg-white p-6 rounded shadow-lg space-y-4 w-full max-w-sm text-black", {
            "animate-shake": shake
          })}
        >
          <h2 className="text-xl font-bold">Enter Admin Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Password"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
