import { useEffect, useState } from "react";

export const EmployeeData = ({ form, employee }: { form: any; employee: any }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-800 via-purple-900 to-black text-white p-6 rounded-2xl shadow-xl space-y-4 border border-white/10">
      <h1 className="text-3xl font-bold tracking-wide border-b border-purple-600 pb-3">
        Welcome, <span className="text-purple-300">{employee.name}</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-base">
        <Field label="EPI" value={employee.epi} />
        <Field label="Role" value={employee.role} />
        <Field label="Type" value={employee.type} />
        <Field label="Exchange" value={employee.exchange} />
        <Field label="Region" value={employee.region} />
        <Field label="Entry Count" value={employee.entryCount} />
        <Field label="Date" value={time.toLocaleDateString()} />
        <Field label="Time" value={time.toLocaleTimeString()} />
      </div>

      <div className="flex justify-between items-center mt-4 flex-col sm:flex-row gap-4">
        {employee.role !== "TSA" && (
          <select
            value={form.type}
            onChange={(e) => (form.type = e.target.value)}
            className="px-6 py-2 rounded-xl text-black font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg backdrop-blur-md border border-white/20 transition-all duration-300 relative overflow-hidden"
          >
            <option value="DDS">DDS (Default)</option>
            <option value="Float">Float</option>
            <option value="Kiosk">Kiosk</option>
          </select>
        )}

        <a
          href={`/detail/${employee.epi}`}
          className="px-6 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg backdrop-blur-md border border-white/20 transition-all duration-300 relative overflow-hidden"
        >
          <span className="relative z-10">View Entries</span>
          <div className="absolute inset-0 bg-white/10 opacity-20 blur-md pointer-events-none" />
        </a>
      </div>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <span className="text-purple-400 font-semibold">{label}:</span>{" "}
    <span className="text-white">{value}</span>
  </div>
);
