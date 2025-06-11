import { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
};

export default function PageHeader({ icon: Icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-purple-600 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
      <p className="text-slate-300">{subtitle}</p>
    </div>
  );
}
