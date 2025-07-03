import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export interface PermissionEntry {
  epi: string;
  name: string;
  level: number;
  pass: string;
}

export function usePermissions() {
  const [data, setData] = useState<PermissionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const savePermission = async (entry: Partial<PermissionEntry>, editingEpi: string | null) => {
    if (!entry.epi || !entry.pass || entry.level == null) {
      toast.error("EPI, password, and level are required.");
      return false;
    }

    try {
      const url = `/api/auth/${editingEpi || entry.epi}`;
      const method = editingEpi ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass: entry.pass, level: entry.level })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");

      toast.success(editingEpi ? "Updated successfully" : "Created successfully");
      fetchData();
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
      return false;
    }
  };

  const deletePermission = async (epi: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      const res = await fetch(`/api/auth/${epi}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetAllPasswords = async (newPassword: string) => {
    if (!confirm("Are you sure you want to reset all passwords?")) return;
    try {
      const res = await fetch("/api/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetAll: true, newPassword })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to reset passwords");

      toast.success(`Passwords reset for ${result.count} users`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, savePermission, deletePermission, resetAllPasswords };
}
