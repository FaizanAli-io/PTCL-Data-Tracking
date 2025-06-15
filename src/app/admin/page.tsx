"use client";

import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";
import SearchBar from "./components/SearchBar";
import EmployeeList from "./components/EmployeeList";
import EmployeeFormDialog from "./components/EmployeeFormDialog";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

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

  const handleSearch = (term: string) => {
    const lower = term.toLowerCase();
    setFiltered(
      employees.filter(
        (e) => e.name.toLowerCase().includes(lower) || e.epi.toString().includes(lower)
      )
    );
  };

  const handleCreate = async (data: any) => {
    const res = await fetch("/api/employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      toast.success("Employee added");
      fetchEmployees();
    } else toast.error("Failed to add employee");
  };

  const handleDelete = async (epi: bigint) => {
    const res = await fetch(`/api/employee/${epi}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Employee deleted");
      fetchEmployees();
    } else toast.error("Failed to delete employee");
  };

  const handleUpdate = async (epi: bigint, updatedData: any) => {
    const res = await fetch(`/api/employee/${epi}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      toast.success("Employee updated");
      fetchEmployees();
    } else toast.error("Failed to update employee");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-purple-300">Employee Management</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={() => setFormOpen(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded"
        >
          Add Employee
        </button>
      </div>

      <EmployeeList
        employees={filtered}
        onDelete={handleDelete}
        onEdit={handleEdit}
        loading={loading}
      />

      <EmployeeFormDialog
        open={dialogOpen}
        setOpen={(val) => {
          setDialogOpen(val);
          if (!val) setEditingEmployee(null);
        }}
        initialData={editingEmployee}
        onSubmit={(data) => {
          if (editingEmployee) handleUpdate(BigInt(editingEmployee.epi), data);
          else handleCreate(data);
        }}
      />
    </div>
  );
}
