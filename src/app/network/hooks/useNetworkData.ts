import { useState, useCallback } from "react";

type RecordType = Record<string, any>;

interface NetworkDataState {
  FDH: RecordType[];
  FAT: RecordType[];
  DC: RecordType[];
  DP: RecordType[];
  isLoading: boolean;
}

interface FetchOptions {
  thresholdEnabled?: boolean;
  threshold?: number;
  limit?: number;
  type?: "GPON" | "XDSL";
}

export const useNetworkData = () => {
  const [state, setState] = useState<NetworkDataState>({
    FDH: [],
    FAT: [],
    DC: [],
    DP: [],
    isLoading: false
  });

  const fetchNetworkData = useCallback(
    async (lat: string, lng: string, options: FetchOptions = {}) => {
      if (!lat || !lng) {
        alert("Please enter valid coordinates or get your location first");
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      const params = new URLSearchParams({ lat, lng });
      if (options.thresholdEnabled && options.threshold)
        params.append("threshold", options.threshold.toString());
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.type) params.append("type", options.type);

      try {
        const res = await fetch(`/api/network?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch network data");

        const data = await res.json();

        setState((prev) => ({
          ...prev,
          FDH: data.FDH || [],
          FAT: data.FAT || [],
          DC: data.DC || [],
          DP: data.DP || [],
          isLoading: false
        }));
      } catch (error) {
        console.error("Error fetching network data:", error);
        alert("Failed to fetch network data. Please try again.");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const clearData = useCallback(() => {
    setState({ FDH: [], FAT: [], DC: [], DP: [], isLoading: false });
  }, []);

  return {
    ...state,
    fetchNetworkData,
    clearData
  };
};
