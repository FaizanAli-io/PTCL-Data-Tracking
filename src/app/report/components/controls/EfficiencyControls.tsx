import { OrderType } from "../../hooks/useEfficiencyData";

type Props = {
  role: string;
  roles: string[];
  setRole: (r: string) => void;
  type: string;
  types: string[];
  setType: (t: string) => void;
  orderType: OrderType;
  setOrderType: (o: OrderType) => void;
  classInterval: number;
  setClassInterval: (n: number) => void;
  maxValue: number;
  setMaxValue: (n: number) => void;
  fetchData: () => void;
  loading: boolean;
};

const orderOptions: { key: string; label: string }[] = [
  { key: "lastMonthPaid", label: "Previous Month Paid" },
  { key: "lastMonthCompleted", label: "Previous Month Completed" },
  { key: "monthToDateGenerated", label: "Current Month Generated" },
  { key: "monthToDatePaid", label: "Current Month Paid" },
  { key: "monthToDateCompleted", label: "Current Month Completed" }
];

export default function EfficiencyControls(props: Props) {
  const {
    role,
    roles,
    setRole,
    type,
    types,
    setType,
    orderType,
    setOrderType,
    classInterval,
    setClassInterval,
    maxValue,
    setMaxValue,
    fetchData,
    loading
  } = props;

  return (
    <div className="bg-gradient-to-br from-purple-900/80 via-slate-800/80 to-purple-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-purple-500/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl" />
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
        {/* Role */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-purple-200">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          >
            <option value="" className="bg-slate-800 text-white">
              All Roles
            </option>
            {roles.map((r) => (
              <option key={r} className="bg-slate-800 text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-purple-200">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          >
            <option value="" className="bg-slate-800 text-white">
              All Types
            </option>
            {types.map((t) => (
              <option key={t} className="bg-slate-800 text-white">
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Order Type */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-purple-200">Order Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as OrderType)}
            className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          >
            {orderOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-slate-800 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Class Interval */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-purple-200">Class Interval (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={classInterval}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 1 && val <= 5) setClassInterval(val);
            }}
            className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          />
        </div>

        {/* Max Value */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-purple-200">Max Value (5-25)</label>
          <input
            type="number"
            min={5}
            max={25}
            value={maxValue}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val >= 5 && val <= 25) setMaxValue(val);
            }}
            className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50"
          />
        </div>

        {/* Generate Report */}
        <div className="flex flex-col justify-end">
          <button
            onClick={fetchData}
            disabled={loading}
            className={`w-full px-6 py-3 rounded-xl text-white font-semibold shadow-xl transform transition-all ${
              loading
                ? "bg-purple-500 opacity-70 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 hover:scale-105"
            }`}
          >
            {loading ? "Loading…" : "Generate Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
