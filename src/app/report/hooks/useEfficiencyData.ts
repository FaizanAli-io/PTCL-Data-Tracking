import { useEffect, useState } from "react";

export type OrderType = "currentPaid" | "currentGenerated" | "previous";

export type EfficiencyData = {
  region: string;
  exchange: string;
  headcount: number;
  buckets: Record<string, number>;
};

export function useEfficiencyData() {
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("currentPaid");
  const [classInterval, setClassInterval] = useState(2);
  const [maxValue, setMaxValue] = useState(10);
  const [data, setData] = useState<EfficiencyData[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/enum-values")
      .then((res) => res.json())
      .then((res) => {
        setRoles(res.data.roles.filter((r: string) => r !== "MGT"));
        setTypes(res.data.types.filter((r: string) => r !== "MGT"));
      })
      .catch(console.error);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report/efficiency", {
        body: JSON.stringify({ role, type, orderType, classInterval, maxValue }),
        method: "POST"
      });
      const result = await res.json();
      setLabels(result.labels);
      setData(result.data);
    } finally {
      setLoading(false);
    }
  };

  return {
    role,
    roles,
    setRole,
    type,
    types,
    setType,
    orderType,
    setOrderType,
    classInterval,
    setClassInterval,
    maxValue,
    setMaxValue,
    data,
    labels,
    loading,
    fetchData
  };
}
