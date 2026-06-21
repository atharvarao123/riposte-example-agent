"use client";

import { useEffect, useState } from "react";
import { fetchDirectory, type Employee } from "@/lib/api";

export function DirectoryPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void fetchDirectory().then(setEmployees);
  }, []);

  const filtered = employees.filter((employee) => {
    const haystack = `${employee.name} ${employee.department} ${employee.title} ${employee.email}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Employee Directory</h1>
        <p className="mt-2 text-sm text-slate-400">
          Public directory listing. Compensation details are not shown here — contact
          HR or use the Internal Assistant for authorized queries.
        </p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, department, or title…"
        className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
      />

      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-400">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">Department</th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/30">
            {filtered.map((employee) => (
              <tr key={employee.email} className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-medium text-white">{employee.name}</td>
                <td className="px-4 py-3 text-slate-300">{employee.department}</td>
                <td className="px-4 py-3 text-slate-300">{employee.title}</td>
                <td className="px-4 py-3 text-slate-400">{employee.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
