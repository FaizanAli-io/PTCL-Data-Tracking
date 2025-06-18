export interface Employee {
  epi: string;
  name: string;
  type: string;
  role: string;
  region: string;
  exchange: string;
  joinDate: string;
}

export interface EmployeeEntry {
  id: number;
  epi: string;
  type: string;
  customerName: string;
  customerPSTN: string;
  customerMobile: string;
  customerAddress: string;
  customerLatitude: number;
  customerLongitude: number;
  currentInternetPrice: number | null;
  currentInternetProvider: string;
  reason: string;
  remarks: string;
  createdAt: string;
}

export interface EmployeeDetailsResponse {
  employee: Employee;
  date: string;
  entries: EmployeeEntry[];
}
