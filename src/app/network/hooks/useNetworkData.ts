import { useState, useCallback } from "react";

type RecordType = Record<string, any>;

interface NetworkDataState {
  fdh: RecordType[];
  fat: RecordType[];
  isLoading: boolean;
}

export const useNetworkData = () => {
  const [state, setState] = useState<NetworkDataState>({
    fdh: [],
    fat: [],
    isLoading: false
  });

  const fetchNetworkData = useCallback(async (lat: string, lng: string) => {
    if (!lat || !lng) {
      alert("Please enter valid coordinates or get your location first");
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch(`/api/network?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error("Failed to fetch network data");

      const { fdh, fat } = await res.json();
      setState({
        fdh: fdh || [],
        fat: fat || [],
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching network data:", error);
      alert("Failed to fetch network data. Please try again.");
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const clearData = useCallback(() => {
    setState({ fdh: [], fat: [], isLoading: false });
  }, []);

  return {
    ...state,
    fetchNetworkData,
    clearData
  };
};
