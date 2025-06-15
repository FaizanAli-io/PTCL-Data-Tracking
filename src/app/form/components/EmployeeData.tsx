import { useEffect, useState } from "react";

export const EmployeeData = ({ employee }: { employee: any }) => {
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
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <span className="text-purple-400 font-semibold">{label}:</span>{" "}
    <span className="text-white">{value}</span>
  </div>
);
