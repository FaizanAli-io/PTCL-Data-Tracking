import { AlertCircle, X } from "lucide-react";

interface ErrorMessageProps {
  error: string;
  onClose: () => void;
}

export const ErrorMessage = ({ error, onClose }: ErrorMessageProps) => (
  <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 shadow-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-red-500/20">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-200">Error Loading Data</h3>
          <p className="text-red-300/80">{error}</p>
        </div>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
        <X className="w-5 h-5 text-red-400" />
      </button>
    </div>
  </div>
);
