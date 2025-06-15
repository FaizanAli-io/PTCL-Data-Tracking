"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function EmployeeFormDialog({
  open,
  setOpen,
  onSubmit,
  initialData
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}) {
  const [form, setForm] = useState({
    epi: "",
    name: "",
    type: "",
    role: "",
    region: "",
    exchange: "",
    joinDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        joinDate: new Date(initialData.joinDate).toISOString().slice(0, 10)
      });
    }
  }, [initialData]);

  const [options, setOptions] = useState({
    roles: [],
    types: [],
    regions: [],
    exchanges: []
  });

  useEffect(() => {
    fetch("/api/report/enum-values")
      .then((res) => res.json())
      .then((json) => setOptions(json.data))
      .catch(() => setOptions({ roles: [], types: [], regions: [], exchanges: [] }));
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const data = { ...form, epi: form.epi.toString(), joinDate: new Date(form.joinDate) };
    onSubmit(data);
    setOpen(false);
    setForm({
      epi: "",
      name: "",
      type: "",
      role: "",
      region: "",
      exchange: "",
      joinDate: new Date().toISOString().slice(0, 10)
    });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 p-6 border border-white/10 text-white shadow-xl space-y-4 relative">
          <button
            className="absolute top-3 right-3 text-white/60 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
          <DialogTitle className="text-lg font-semibold">Add New Employee</DialogTitle>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="epi"
              type="number"
              placeholder="EPI"
              value={form.epi}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-purple-950 text-white border border-white/20 focus:outline-none"
            />
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-purple-950 text-white border border-white/20 focus:outline-none"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-purple-950 text-white border border-white/20 focus:outline-none"
            >
              <option value="">Select Role</option>
              {options.roles.map((r: string) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-purple-950 text-white border border-white/20 focus:outline-none"
            >
              <option value="">Select Type</option>
              {options.types.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-purple-950 text-white border border-white/20 focus:outline-none"
            >
              <option value="">Select Region</option>
              {options.regions.map((r: string) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              name="exchange"
              value={form.exchange}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-purple-950 text-white border border-white/20 focus:outline-none"
            >
              <option value="">Select Exchange</option>
              {options.exchanges.map((e: string) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="joinDate"
              value={form.joinDate}
              onChange={handleChange}
              className="px-3 py-2 rounded bg-purple-950 text-white border border-white/20 focus:outline-none"
            />
          </div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
            >
              Save Employee
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
