"use client";

import { useEffect, useState } from "react";
import PermissionGate from "@/components/PermissionGate";
import { toast } from "react-hot-toast";

interface PermissionEntry {
  epi: string;
  name: string;
  level: number;
  pass: string;
}

export default function PermissionsPage() {
  const [data, setData] = useState<PermissionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Partial<PermissionEntry>>({
    epi: "",
    pass: "",
    level: 1
  });
  const [editingEpi, setEditingEpi] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/auth");
      const json = await res.json();
      if (res.ok) {
        setData(json.data.sort((a: PermissionEntry, b: PermissionEntry) => b.level - a.level));
      } else {
        setError(json.message || "Failed to load data.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!form.epi || !form.pass || form.level == null) {
      toast.error("EPI, password, and level are required.");
      return;
    }

    try {
      const url = `/api/auth/${editingEpi ? editingEpi : form.epi}`;

      const res = await fetch(url, {
        method: editingEpi ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass: form.pass, level: form.level })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Save failed");
      }

      toast.success(editingEpi ? "Updated successfully" : "Created successfully");
      setForm({ epi: "", level: 1, pass: "" });
      setEditingEpi(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleEdit = (entry: PermissionEntry) => {
    setEditingEpi(entry.epi);
    setForm(entry);
  };

  const handleDelete = async (epi: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      const res = await fetch(`/api/auth/${epi}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <PermissionGate minLevel={4}>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Manage Permissions</h1>

        <div className="flex justify-center mb-10">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingEpi ? "Edit Permission" : "Add Permission"}
              </h2>
              {editingEpi && (
                <button
                  className="text-sm text-blue-400 hover:underline"
                  onClick={() => {
                    setEditingEpi(null);
                    setForm({ epi: "", level: 1, pass: "" });
                  }}
                >
                  Switch to Insert
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm mb-1">EPI</label>
                <input
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                  placeholder="EPI"
                  value={form.epi || ""}
                  onChange={(e) => {
                    if (!editingEpi) setForm({ ...form, epi: e.target.value });
                  }}
                  disabled={!!editingEpi}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                  placeholder="Password"
                  value={form.pass || ""}
                  onChange={(e) => setForm({ ...form, pass: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Level</label>
                <input
                  type="number"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                  placeholder="Level"
                  value={form.level ?? 1}
                  onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <button
                  onClick={handleSave}
                  className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  {editingEpi ? "Update" : "Add"} Permission
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-700 px-4 py-2 text-left">EPI</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Level</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Password</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => (
                  <tr key={entry.epi} className="hover:bg-gray-800 transition">
                    <td className="border border-gray-700 px-4 py-2 font-mono">{entry.epi}</td>
                    <td className="border border-gray-700 px-4 py-2">{entry.name}</td>
                    <td className="border border-gray-700 px-4 py-2">{entry.level}</td>
                    <td className="border border-gray-700 px-4 py-2 font-mono">{entry.pass}</td>
                    <td className="border border-gray-700 px-4 py-2 space-x-2">
                      {entry.level < 4 ? (
                        <>
                          <button
                            onClick={() => handleEdit(entry)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-yellow-300 bg-yellow-900 rounded hover:bg-yellow-800"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry.epi)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-300 bg-red-900 rounded hover:bg-red-800"
                          >
                            🗑 Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500 italic">Restricted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}
