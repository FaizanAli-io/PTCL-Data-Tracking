import { Search, Loader2 } from "lucide-react";

interface SearchButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const SearchButton = ({ isLoading, disabled, onClick }: SearchButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-fit"
  >
    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
    {isLoading ? "Searching..." : "Find Network Points"}
  </button>
);
