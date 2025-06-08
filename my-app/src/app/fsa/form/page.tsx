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

const fields = [
  { name: "epi", label: "EPI" },
  { name: "fsaName", label: "FSA Name" },
  { name: "exchange", label: "Exchange", type: "select", options: exchanges },
  { name: "customerName", label: "Customer Name" },
  { name: "customerMobile", label: "Customer Mobile" },
  { name: "locationAddress", label: "Location Address" },
  { name: "locationLatitude", label: "Location Latitude" },
  { name: "locationLongitude", label: "Location Longitude" },
  { name: "locationAltitude", label: "Location Altitude" },
  { name: "locationAccuracy", label: "Location Accuracy" },
  { name: "currentInternetProvider", label: "Current Internet Provider" },
  { name: "currentInternetPrice", label: "Current Internet Monthly Price" },
  { name: "remarks", label: "Remarks" }
];

export default function Form1() {
  const [form, setForm] = useState(Object.fromEntries(fields.map((f) => [f.name, ""])));

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, altitude, accuracy } = pos.coords;
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GEOCODING_API_KEY}`
        );
        const data = await res.json();
        const address = data.results?.[0]?.formatted_address || "";
        setForm((f) => ({
          ...f,
          locationLatitude: latitude.toString(),
          locationLongitude: longitude.toString(),
          locationAltitude: (altitude || 0).toString(),
          locationAccuracy: accuracy.toString(),
          locationAddress: address
        }));
      },
      (err) => console.error(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const submit = async () => {
    await fetch("/api/fsa", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        epi: parseInt(form.epi),
        currentInternetPrice: form.currentInternetPrice
          ? parseInt(form.currentInternetPrice)
          : null,
        locationLatitude: parseFloat(form.locationLatitude),
        locationLongitude: parseFloat(form.locationLongitude),
        locationAltitude: parseFloat(form.locationAltitude),
        locationAccuracy: parseFloat(form.locationAccuracy)
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
      <h1 className="text-2xl font-bold mb-4 text-gray-900">FSA Form</h1>
      <button
        type="button"
        onClick={getLocation}
        className="p-2 bg-gray-800 text-white rounded w-full"
      >
        Get Location & Address
      </button>
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
