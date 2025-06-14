import { LucideIcon } from "lucide-react";

type SummaryCardItem = {
  icon: LucideIcon;
  color: string;
  label: string;
  value: number | string;
  description?: string;
};

type SummaryCardsProps = {
  items: SummaryCardItem[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  cardClassName?: string;
};

export default function SummaryCards({
  items,
  columns = 4,
  className = "",
  cardClassName = ""
}: SummaryCardsProps) {
  const gridClass = `grid grid-cols-1 ${columns >= 2 ? "md:grid-cols-2" : ""} ${
    columns >= 3 ? "lg:grid-cols-3" : ""
  } ${columns >= 4 ? "xl:grid-cols-4" : ""} ${columns >= 5 ? "2xl:grid-cols-5" : ""} ${
    columns >= 6 ? "3xl:grid-cols-6" : ""
  } gap-6 ${className}`;

  return (
    <div className={gridClass}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${cardClassName}`}
        >
          <div className="flex items-center gap-3">
            <item.icon className={`w-8 h-8 ${item.color}`} />
            <div>
              <p className="text-slate-300 text-sm">{item.label}</p>
              <p className="text-2xl font-bold text-white">{item.value}</p>
              {item.description && (
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
