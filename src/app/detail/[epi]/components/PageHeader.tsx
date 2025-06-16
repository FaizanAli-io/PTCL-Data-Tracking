import { User, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  employeeName?: string;
  epi: string;
}

export const PageHeader = ({ employeeName, epi }: PageHeaderProps) => (
  <div className="text-center space-y-4">
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mb-4"
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Home
    </Link>

    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-400/30">
        <User className="w-8 h-8 text-purple-300" />
      </div>
      <div className="text-left">
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
          {employeeName || "Employee Details"}
        </h1>
        <p className="text-purple-300/80 text-lg">EPI: {epi}</p>
      </div>
    </div>
  </div>
);
