import { useState } from "react";

interface Props {
  onReset: (newPassword: string) => void;
}

export default function ResetAllPasswordsBox({ onReset }: Props) {
  const [password, setPassword] = useState("");

  const handleReset = () => {
    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      alert("Please enter a new password.");
      return;
    }

    onReset(trimmedPassword);
    setPassword("");
  };

  return (
    <div className="bg-red-900 p-6 rounded-xl shadow-md max-w-2xl mx-auto mt-10 text-center">
      <h2 className="text-xl font-semibold text-white mb-2">Reset All Passwords</h2>
      <p className="text-sm text-red-200 mb-4">
        This will reset the password of all users (except admins). This action is irreversible.
      </p>

      <input
        type="text"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-sm mx-auto mb-4 px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white mr-2"
      />

      <button
        onClick={handleReset}
        className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold text-white transition"
      >
        🔁 Reset All Passwords
      </button>
    </div>
  );
}
