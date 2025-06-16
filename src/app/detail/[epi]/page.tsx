"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { getTodayDateString } from "./utils/dateUtils";
import { useEmployeeDetails } from "./hooks/useEmployeeDetails";

import { PageHeader } from "./components/PageHeader";
import { DateSelector } from "./components/DateSelector";
import { EmployeeCard } from "./components/EmployeeCard";
import { EntriesTable } from "./components/EntriesTable";
import { ErrorMessage } from "./components/ErrorMessage";
import { BackgroundEffects } from "./components/BackgroundEffects";

export default function EmployeeDetailPage() {
  const params = useParams();
  const epi = params?.epi as string;

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  const { employee, entries, isLoading, error, fetchEmployeeDetails, clearError } =
    useEmployeeDetails(epi);

  useEffect(() => {
    if (epi && selectedDate) {
      fetchEmployeeDetails(selectedDate);
    }
  }, [epi, fetchEmployeeDetails]);

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleSearch = useCallback(() => {
    if (selectedDate) {
      fetchEmployeeDetails(selectedDate);
    }
  }, [selectedDate, fetchEmployeeDetails]);

  if (!epi) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 flex items-center justify-center">
        <div className="text-center text-purple-200">
          <h1 className="text-2xl font-bold mb-2">Invalid Employee ID</h1>
          <p>Please provide a valid employee EPI.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 p-4 sm:p-6">
      <BackgroundEffects />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <PageHeader employeeName={employee?.name} epi={epi} />

        <DateSelector
          date={selectedDate}
          onDateChange={handleDateChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {error && <ErrorMessage error={error} onClose={clearError} />}

        {employee && <EmployeeCard employee={employee} />}

        <EntriesTable entries={entries} date={selectedDate} />
      </div>
    </div>
  );
}
