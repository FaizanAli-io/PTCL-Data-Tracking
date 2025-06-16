import { useState, useCallback } from "react";
import { Employee, EmployeeEntry, EmployeeDetailsResponse } from "../types/employee";

interface EmployeeDetailsState {
  employee: Employee | null;
  entries: EmployeeEntry[];
  isLoading: boolean;
  error: string | null;
  lastFetchedDate: string | null;
}

export const useEmployeeDetails = (epi: string) => {
  const [state, setState] = useState<EmployeeDetailsState>({
    employee: null,
    entries: [],
    isLoading: false,
    error: null,
    lastFetchedDate: null
  });

  const fetchEmployeeDetails = useCallback(
    async (date: string) => {
      if (!epi || !date) return;

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`/api/employee/${epi}/entries?date=${date}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch employee details: ${response.statusText}`);
        }

        const data: EmployeeDetailsResponse = await response.json();

        setState({
          employee: data.employee,
          entries: data.entries || [],
          isLoading: false,
          error: null,
          lastFetchedDate: date
        });
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "An unknown error occurred"
        }));
      }
    },
    [epi]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchEmployeeDetails,
    clearError
  };
};
