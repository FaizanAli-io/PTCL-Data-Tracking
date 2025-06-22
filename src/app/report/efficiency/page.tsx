"use client";

import { useEfficiencyData } from "../hooks/useEfficiencyData";
import EfficiencyTable from "../components/tables/EfficiencyTable";
import EfficiencyControls from "../components/controls/EfficiencyControls";

export default function EfficiencyReportPage() {
  const {
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
  } = useEfficiencyData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 text-white p-8 space-y-8">
      <h1 className="text-center text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 drop-shadow-2xl">
        Efficiency Report
      </h1>
      <EfficiencyControls
        role={role}
        roles={roles}
        setRole={setRole}
        type={type}
        types={types}
        setType={setType}
        orderType={orderType}
        setOrderType={setOrderType}
        classInterval={classInterval}
        setClassInterval={setClassInterval}
        maxValue={maxValue}
        setMaxValue={setMaxValue}
        fetchData={fetchData}
        loading={loading}
      />

      {data.length > 0 && <EfficiencyTable data={data} labels={labels} />}
    </div>
  );
}
