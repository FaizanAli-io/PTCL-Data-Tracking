import { PermissionEntry } from "../hooks/usePermissions";

interface Props {
  data: PermissionEntry[];
  onEdit: (entry: PermissionEntry) => void;
  onDelete: (epi: string) => void;
}

export default function PermissionTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="border px-4 py-2">EPI</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Level</th>
            <th className="border px-4 py-2">Password</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.epi} className="hover:bg-gray-800">
              <td className="border px-4 py-2 font-mono">{entry.epi}</td>
              <td className="border px-4 py-2">{entry.name}</td>
              <td className="border px-4 py-2">{entry.level}</td>
              <td className="border px-4 py-2 font-mono">{entry.pass}</td>
              <td className="border px-4 py-2 space-x-2">
                {entry.level < 4 ? (
                  <>
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-yellow-300 bg-yellow-900 px-3 py-1 rounded hover:bg-yellow-800 text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => onDelete(entry.epi)}
                      className="text-red-300 bg-red-900 px-3 py-1 rounded hover:bg-red-800 text-sm"
                    >
                      🗑 Delete
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 italic">Restricted</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
