import { useEffect, useState } from "react";

type FilterOptions = {
  roles: string[];
  types: string[];
  regions: string[];
  exchanges: string[];
};

export function useFilterOptions() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    roles: [],
    types: [],
    regions: [],
    exchanges: []
  });
  const [filterLoading, setFilterLoading] = useState(false);

  const fetchFilterOptions = async () => {
    setFilterLoading(true);
    try {
      const res = await fetch("/api/report/enum-values");
      const result = await res.json();
      if (result.success) {
        const data = result.data;
        setFilterOptions({
          roles: data.roles.filter((r: string) => r !== "MGT"),
          types: data.types.filter((t: string) => t !== "MGT"),
          regions: data.regions.filter((t: string) => t !== "KTR N"),
          exchanges: data.exchanges
        });
      }
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return { filterOptions, filterLoading };
}
