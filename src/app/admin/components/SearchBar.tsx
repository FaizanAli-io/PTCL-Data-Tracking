export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Search by name or EPI..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full md:w-1/3 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}
