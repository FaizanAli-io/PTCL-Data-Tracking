interface SearchOptionsProps {
  thresholdEnabled: boolean;
  threshold: string;
  limit: string;
  type: string;
  onThresholdToggle: (enabled: boolean) => void;
  onThresholdChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export const SearchOptions = ({
  thresholdEnabled,
  threshold,
  limit,
  type,
  onThresholdToggle,
  onThresholdChange,
  onLimitChange,
  onTypeChange
}: SearchOptionsProps) => (
  <div className="mt-6 flex flex-col sm:flex-row gap-10 items-center flex-wrap">
    <label className="flex items-center gap-2 text-purple-200">
      <input
        type="checkbox"
        checked={thresholdEnabled}
        onChange={(e) => onThresholdToggle(e.target.checked)}
        className="accent-purple-500 w-5 h-5"
      />
      Set Threshold (Meters)
    </label>

    <label className="flex items-center gap-2 text-purple-200">
      Threshold:
      <input
        type="number"
        step="any"
        placeholder="Threshold (meters)"
        value={threshold}
        onChange={(e) => onThresholdChange(e.target.value)}
        disabled={!thresholdEnabled}
        className="px-4 py-2 bg-purple-800/30 border border-purple-500/40 rounded-xl text-purple-100 placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:bg-purple-800/40 transition-all duration-300 disabled:opacity-50"
      />
    </label>

    <label className="flex items-center gap-2 text-purple-200">
      Limit:
      <input
        type="number"
        step="1"
        placeholder="Limit"
        value={limit}
        onChange={(e) => onLimitChange(e.target.value)}
        className="px-4 py-2 bg-purple-800/30 border border-purple-500/40 rounded-xl text-purple-100 placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:bg-purple-800/40 transition-all duration-300"
      />
    </label>

    <label className="flex items-center gap-2 text-purple-200">
      Type:
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-4 py-2 bg-purple-800/30 border border-purple-500/40 rounded-xl text-purple-100 focus:outline-none focus:border-purple-400 focus:bg-purple-800/40 transition-all duration-300"
      >
        <option value="GPON">GPON</option>
        <option value="XDSL">XDSL</option>
      </select>
    </label>
  </div>
);
