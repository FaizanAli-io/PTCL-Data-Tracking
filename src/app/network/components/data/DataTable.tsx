type RecordType = Record<string, any>;

interface DataTableProps {
  title: string;
  description: string;
  data: RecordType[];
}

export const DataTable = ({ title, description, data }: DataTableProps) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-100 mb-2">{title}</h2>
        <p className="text-purple-200/70">{description}</p>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-80 overflow-y-auto rounded-xl border border-purple-500/30">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-purple-800/50 backdrop-blur-sm border-b border-purple-500/30">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left font-semibold text-purple-200 whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-purple-500/20 hover:bg-purple-800/30 transition-colors duration-200"
                >
                  {Object.values(item).map((val, i) => (
                    <td key={i} className="px-4 py-3 text-purple-100 whitespace-nowrap">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
