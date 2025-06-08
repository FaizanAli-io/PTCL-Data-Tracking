"use client";

import { useState } from "react";

const exchanges = [
  "KAP",
  "MMC",
  "Hijri",
  "Hadeed",
  "Jauhar",
  "Maymar",
  "Gulshan",
  "Azizabad",
  "Nazimabad",
  "Orangi_SITE",
  "Pak_Capital",
  "North_Karachi_Surjani"
];

const remarksOptions = [
  "Contacted_Interested",
  "Contacted_Already_User",
  "Contacted_Not_Interested",
  "Switched_Off",
  "Unresponsive"
];

const fields = [
  { name: "epi", label: "EPI" },
  { name: "tsaName", label: "TSA Name" },
  { name: "callerExchange", label: "Caller Exchange", type: "select", options: exchanges },
  { name: "customerName", label: "Customer Name" },
  { name: "customerMobile", label: "Customer Mobile" },
  { name: "customerAddress", label: "Customer Address" },
  { name: "customerExchange", label: "Customer Exchange", type: "select", options: exchanges },
  { name: "dialingRemarks", label: "Dialing Remarks", type: "select", options: remarksOptions }
];

export default function Form2() {
  const [form, setForm] = useState(Object.fromEntries(fields.map((f) => [f.name, ""])));

  const submit = async () => {
    await fetch("/api/tsa", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        epi: parseInt(form.epi)
      })
    });
  };

  const onChange = (name: string, value: string) => setForm((f) => ({ ...f, [name]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="max-w-xl mx-auto p-6 bg-white shadow rounded-md space-y-4"
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-900">TSA Form</h1>
      {fields.map(({ name, label, type, options }) =>
        type === "select" ? (
          <div key={name}>
            <label className="font-semibold text-gray-900">{label}</label>
            <select
              value={form[name]}
              onChange={(e) => onChange(name, e.target.value)}
              className="mt-1 w-full p-2 border rounded text-gray-900"
            >
              <option value="">Select {label}</option>
              {options!.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div key={name}>
            <label className="font-semibold text-gray-900">{label}</label>
            <input
              type="text"
              value={form[name]}
              onChange={(e) => onChange(name, e.target.value)}
              className="mt-1 w-full p-2 border rounded text-gray-900"
            />
          </div>
        )
      )}
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
}
