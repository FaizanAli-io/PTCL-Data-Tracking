"use client";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import Filters from "./components/Filters";
import SearchBar from "./components/SearchBar";
import EmployeeList from "./components/EmployeeList";
import EmployeeDialog from "./components/EmployeeDialog";
import DownloadDialog from "./components/DownloadDialog";

import PasswordGate from "@/components/PasswordGate";

type Employee = {
  epi: string;
  name: string;
  role: string;
  type: string;
  region: string;
  exchange: string;
  joinDate: string | Date;
};

export default function EmployeePage() {
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({
    role: "",
    type: "",
    region: "",
    exchange: ""
  });
  const [options, setOptions] = useState<Record<string, string[]>>({
    roles: [],
    types: [],
    regions: [],
    exchanges: []
  });

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employee");
      const data = await res.json();
      setEmployees(data);
      setFiltered(data);
    } catch (e) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetch("/api/enum-values")
      .then((res) => res.json())
      .then((json) => setOptions(json.data))
      .catch(() => setOptions({ roles: [], types: [], regions: [], exchanges: [] }));
  }, []);

  useEffect(() => {
    handleSearch("");
  }, [filters]);

  const handleSearch = (term: string) => {
    const lower = term.toLowerCase();

    const result = employees.filter((e) => {
      const matchesSearch = e.name.toLowerCase().includes(lower) || e.epi.includes(lower);

      const matchesFilters =
        (!filters.role || e.role === filters.role) &&
        (!filters.type || e.type === filters.type) &&
        (!filters.region || e.region === filters.region) &&
        (!filters.exchange || e.exchange === filters.exchange);

      return matchesSearch && matchesFilters;
    });

    setFiltered(result);
  };

  function sanitizeEmployee(data: Employee) {
    if (data.region) data.region = data.region.replace(/\s+/g, "_");
    if (data.exchange) data.exchange = data.exchange.replace(/\s+/g, "_");
    return data;
  }

  const handleCreate = async (data: any) => {
    const res = await fetch("/api/employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizeEmployee(data))
    });
    if (res.ok) {
      toast.success("Employee added");
      fetchEmployees();
    } else toast.error("Failed to add employee");
  };

  const handleUpdate = async (epi: string, updatedData: any) => {
    const res = await fetch(`/api/employee/${epi}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitizeEmployee(updatedData))
    });

    if (res.ok) {
      toast.success("Employee updated");
      fetchEmployees();
    } else toast.error("Failed to update employee");
  };

  const handleDelete = async (epi: string) => {
    const res = await fetch(`/api/employee/${epi}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Employee deleted");
      fetchEmployees();
    } else toast.error("Failed to delete employee");
  };

  const handleDownloadAll = () => setDownloadOpen(true);

  return (
    <PasswordGate>
      <div className="min-h-screen bg-gradient-to-br from-[#2a064f] to-[#1a0644] text-white p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span className="bg-purple-600 text-white p-2 rounded-lg">📊</span>
            Employee Administration Dashboard
          </h1>
          <p className="text-sm text-white/70 mt-1 ml-20">
            Centralized interface to manage, monitor, and maintain employee records and analytics.
          </p>
        </div>

        <div className="space-y-4 bg-white/5 backdrop-blur p-4 rounded-xl border border-white/10 shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
            <SearchBar onSearch={handleSearch} />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownloadAll}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded shadow"
              >
                Download All Entries
              </button>
              <a
                href="/orders"
                className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-5 py-2 rounded shadow flex items-center justify-center"
              >
                View Paid Orders
              </a>
              <button
                onClick={() => setDialogOpen(true)}
                className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white px-5 py-2 rounded shadow"
              >
                Add Employee
              </button>
            </div>
          </div>

          <Filters
            options={options}
            filters={filters}
            setFilters={setFilters}
            onFilterChange={setFilters}
          />
        </div>

        <EmployeeList
          employees={filtered}
          onDelete={handleDelete}
          onEdit={handleEdit}
          loading={loading}
        />

        <EmployeeDialog
          open={dialogOpen}
          options={options}
          setOpen={(val: boolean) => {
            setDialogOpen(val);
            if (!val) setEditingEmployee(null);
          }}
          onSubmit={(data: Employee) => {
            if (editingEmployee) handleUpdate(editingEmployee.epi, data);
            else handleCreate(data);
          }}
          initialData={editingEmployee}
        />
      </div>
      <DownloadDialog open={downloadOpen} setOpen={setDownloadOpen} />
    </PasswordGate>
  );
}
