import { EfficiencyData } from "../../hooks/useEfficiencyData";

type Props = {
  labels: string[];
  data: EfficiencyData[];
};

export default function EfficiencyTable({ labels, data }: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-900/60 via-slate-800/60 to-purple-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-white border-collapse">
          <thead className="bg-gradient-to-r from-purple-800/60 to-indigo-800/60 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="p-4 text-purple-200 font-semibold whitespace-nowrap">Region</th>
              <th className="p-4 text-purple-200 font-semibold whitespace-nowrap">Exchange</th>
              <th className="p-4 text-purple-200 font-semibold whitespace-nowrap">Headcount</th>
              {labels.map((label) => (
                <th
                  key={label}
                  className="p-4 text-purple-200 font-semibold whitespace-nowrap text-center"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-purple-500/20">
            {data.map((row, rowIndex) => (
              <tr
                key={`${row.region}-${row.exchange}`}
                className={`hover:bg-purple-800/20 transition-colors ${
                  rowIndex % 2 === 0 ? "bg-purple-900/40" : "bg-slate-900/40"
                }`}
              >
                <td className="p-4 text-purple-100 whitespace-nowrap">{row.region}</td>
                <td className="p-4 text-purple-100 whitespace-nowrap">{row.exchange}</td>
                <td className="p-4 text-purple-100 whitespace-nowrap">{row.headcount}</td>

                {labels.map((label) => {
                  const value = row.buckets[label] || 0;
                  const proportion = value / row.headcount;
                  const lightness = 80 - proportion * 50;

                  return (
                    <td key={label} className="p-3 text-center">
                      <span
                        className="inline-block w-10 h-10 leading-10 rounded-full font-bold text-center text-black shadow-md transition-transform transform hover:scale-110"
                        style={{ backgroundColor: `hsl(0, 100%, ${lightness}%)` }}
                      >
                        {value}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
