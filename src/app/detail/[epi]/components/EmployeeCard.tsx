import { User, MapPin, Calendar, Briefcase, Building } from "lucide-react";
import { Employee } from "../types/employee";
import { formatDate } from "../utils/dateUtils";

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => (
  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/30">
        <User className="w-8 h-8 text-purple-300" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-purple-100">{employee.name}</h2>
        <p className="text-purple-300/80 text-lg">EPI: {employee.epi}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20">
        <Briefcase className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-purple-300/70">Role</p>
          <p className="font-semibold text-purple-100">{employee.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20">
        <Building className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-purple-300/70">Type</p>
          <p className="font-semibold text-purple-100">{employee.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20">
        <MapPin className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-purple-300/70">Region</p>
          <p className="font-semibold text-purple-100">{employee.region}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20">
        <Building className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-purple-300/70">Exchange</p>
          <p className="font-semibold text-purple-100">{employee.exchange}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20 md:col-span-2 lg:col-span-1">
        <Calendar className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-sm text-purple-300/70">Join Date</p>
          <p className="font-semibold text-purple-100">{formatDate(employee.joinDate)}</p>
        </div>
      </div>
    </div>
  </div>
);
