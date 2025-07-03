"use client";

import { useState } from "react";
import PermissionGate from "@/components/PermissionGate";
import PermissionForm from "./components/PermissionForm";
import PermissionTable from "./components/PermissionTable";
import ResetAllPasswordsBox from "./components/ResetAllPasswordsBox";
import { usePermissions, PermissionEntry } from "./hooks/usePermissions";

export default function PermissionsPage() {
  const { data, loading, error, savePermission, deletePermission, resetAllPasswords } =
    usePermissions();
  const [form, setForm] = useState<Partial<PermissionEntry>>({ epi: "", pass: "", level: 1 });
  const [editingEpi, setEditingEpi] = useState<string | null>(null);

  const handleSubmit = async () => {
    const success = await savePermission(form, editingEpi);
    if (success) {
      setForm({ epi: "", pass: "", level: 1 });
      setEditingEpi(null);
    }
  };

  return (
    <PermissionGate minLevel={4}>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Manage Permissions</h1>

        <div className="flex justify-center mb-10">
          <PermissionForm
            form={form}
            setForm={setForm}
            editingEpi={editingEpi}
            onCancel={() => {
              setEditingEpi(null);
              setForm({ epi: "", level: 1, pass: "" });
            }}
            onSubmit={handleSubmit}
          />
        </div>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-400 text-center">{error}</p>
        ) : (
          <PermissionTable
            data={data}
            onEdit={(entry) => {
              setEditingEpi(entry.epi);
              setForm(entry);
            }}
            onDelete={deletePermission}
          />
        )}

        <ResetAllPasswordsBox onReset={resetAllPasswords} />
      </div>
    </PermissionGate>
  );
}
