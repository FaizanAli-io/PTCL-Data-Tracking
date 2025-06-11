import { Users, TrendingUp, Calendar, LucideIcon } from "lucide-react";

type SummaryCardProps = {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
};

const SummaryCard = ({ icon: Icon, iconColor, label, value }: SummaryCardProps) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
    <div className="flex items-center gap-3">
      <Icon className={`w-8 h-8 ${iconColor}`} />
      <div>
        <p className="text-slate-300 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

type SummaryCardsProps = {
  totalEmployees: number;
  avgEntryCount: string | number;
  totalAbsent: number;
};

export default function SummaryCards({
  totalEmployees,
  avgEntryCount,
  totalAbsent
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard
        icon={Users}
        iconColor="text-blue-400"
        label="Total Employees"
        value={totalEmployees}
      />
      <SummaryCard
        icon={TrendingUp}
        iconColor="text-green-400"
        label="Avg Entry Count"
        value={avgEntryCount}
      />
      <SummaryCard
        icon={Calendar}
        iconColor="text-red-400"
        label="Total Absent Days"
        value={totalAbsent}
      />
    </div>
  );
}
