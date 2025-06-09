import { useEffect, useState } from "react";

export const EmployeeData = ({ employee }: { employee: any }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="space-y-2 text-white bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-5 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold border-b border-gray-600 pb-2">Welcome {employee.name}</h1>
      {["epi", "role", "type", "exchange"].map((k) => (
        <div key={k}>
          <span className="font-semibold">{k.charAt(0).toUpperCase() + k.slice(1)}:</span>{" "}
          {employee[k]}
        </div>
      ))}
      <div>
        <span className="font-semibold">Date:</span> {time.toLocaleDateString()}
      </div>
      <div>
        <span className="font-semibold">Time:</span> {time.toLocaleTimeString()}
      </div>
    </div>
  );
};
