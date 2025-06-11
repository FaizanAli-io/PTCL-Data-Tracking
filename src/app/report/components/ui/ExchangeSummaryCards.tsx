import { Building2, TrendingUp, Award, MapPin, LucideIcon } from "lucide-react";

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

type ExchangeSummaryCardsProps = {
  topRegion: string;
  topExchange: string;
  totalRegions: number;
  totalExchanges: number;
};

export default function ExchangeSummaryCards({
  topRegion,
  topExchange,
  totalRegions,
  totalExchanges
}: ExchangeSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <SummaryCard
        icon={TrendingUp}
        iconColor="text-green-400"
        label="Top Region"
        value={topRegion}
      />
      <SummaryCard
        icon={Award}
        iconColor="text-yellow-400"
        label="Top Exchange"
        value={topExchange}
      />
      <SummaryCard
        icon={MapPin}
        iconColor="text-purple-400"
        label="Total Regions"
        value={totalRegions}
      />
      <SummaryCard
        icon={Building2}
        iconColor="text-blue-400"
        label="Total Exchanges"
        value={totalExchanges}
      />
    </div>
  );
}
