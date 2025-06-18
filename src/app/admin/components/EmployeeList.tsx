import clsx from "clsx";

import Link from "next/link";

const badgeColors: Record<string, string> = {
  MGT: "bg-black text-white",
  FSA: "bg-blue-600 text-white",
  TSA: "bg-green-600 text-white",
  FFO: "bg-yellow-600 text-white",
  OSP: "bg-orange-500 text-white",
  REG: "bg-pink-500 text-white"
};

export default function EmployeeList({
  employees,
  onDelete,
  onEdit,
  loading
}: {
  employees: any[];
  onDelete: (epi: string) => void;
  onEdit: (employee: any) => void;
  loading: boolean;
}) {
  if (loading) return <p className="text-white">Loading employees...</p>;
  if (!employees.length) return <p className="text-white">No employees found.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 shadow-inner">
      <table className="min-w-full text-sm text-white">
        <thead className="bg-white/10 rounded-t-2xl">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">EPI</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Role</th>
            <th className="px-4 py-3 text-left font-semibold">Type</th>
            <th className="px-4 py-3 text-left font-semibold">Region</th>
            <th className="px-4 py-3 text-left font-semibold">Exchange</th>
            <th className="px-4 py-3 text-left font-semibold">Join Date</th>
            <th className="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e, idx) => (
            <tr
              key={e.epi}
              className={clsx(
                "transition hover:bg-white/10",
                idx % 2 === 0 ? "bg-white/5" : "bg-white/10"
              )}
            >
              <td className="px-4 py-3 font-semibold">{e.epi}</td>
              <td className="px-4 py-3">
                <Link href={`/detail/${e.epi}`} className="hover:underline text-emerald-300">
                  {e.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    badgeColors[e.role] || "bg-gray-500 text-white"
                  )}
                >
                  {e.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={clsx(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    badgeColors[e.type] || "bg-gray-500 text-white"
                  )}
                >
                  {e.type}
                </span>
              </td>
              <td className="px-4 py-3">{e.region}</td>
              <td className="px-4 py-3">{e.exchange}</td>
              <td className="px-4 py-3">
                {new Date(e.joinDate)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })
                  .replace(/ /g, "-")}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onEdit(e)}
                    className="text-sm px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${e.name}? All their entries will be deleted as well...`
                        )
                      ) {
                        onDelete(e.epi);
                      }
                    }}
                    className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
