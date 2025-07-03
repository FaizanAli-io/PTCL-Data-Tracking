import { PermissionEntry } from "../hooks/usePermissions";

interface Props {
  form: Partial<PermissionEntry>;
  setForm: (form: Partial<PermissionEntry>) => void;
  editingEpi: string | null;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function PermissionForm({ form, setForm, editingEpi, onCancel, onSubmit }: Props) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {editingEpi ? "Edit Permission" : "Add Permission"}
        </h2>
        {editingEpi && (
          <button className="text-sm text-blue-400 hover:underline" onClick={onCancel}>
            Switch to Insert
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm mb-1">EPI</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
            value={form.epi || ""}
            disabled={!!editingEpi}
            onChange={(e) => !editingEpi && setForm({ ...form, epi: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
            value={form.pass || ""}
            onChange={(e) => setForm({ ...form, pass: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Level</label>
          <input
            type="number"
            className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
            value={form.level ?? 1}
            onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <button
            onClick={onSubmit}
            className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
          >
            {editingEpi ? "Update" : "Add"} Permission
          </button>
        </div>
      </div>
    </div>
  );
}
