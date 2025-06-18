"use client";

import { useState } from "react";

import { EmployeeData } from "./components/EmployeeData";
import { ServiceDetails } from "./components/ServiceDetails";
import { LocationAndAddress } from "./components/LocationAndAddress";
import { CustomerInformation } from "./components/CustomerInformation";

export const BaseForm = ({
  form,
  errors,
  onChange,
  onSubmit,
  employee,
  submitting,
  cooldownLeft,
  isFieldAgent
}: {
  form: any;
  errors: string[];
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  employee: any;
  submitting: boolean;
  cooldownLeft: number;
  isFieldAgent: boolean;
}) => {
  const [gpsAccuracy, setGpsAccuracy] = useState("");
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setGpsAccuracy(coords.accuracy.toFixed(2));
        onChange("customerLatitude", coords.latitude.toString());
        onChange("customerLongitude", coords.longitude.toString());
        const errorMessage = "Accuracy too poor, must be under 5000 meters";

        if (coords.accuracy > 5000) {
          setLocalErrors((prev) => (prev.includes(errorMessage) ? prev : [...prev, errorMessage]));
        } else {
          setLocalErrors((prev) => prev.filter((e) => e !== errorMessage));
        }
      },
      console.error,
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );
  };

  const generateAddress = async () => {
    if (!form.customerLatitude || !form.customerLongitude) return;

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${form.customerLatitude},${form.customerLongitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const address = (await res.json()).results?.[0]?.formatted_address || "";
      onChange("customerAddress", address);
    } catch (error) {
      console.error("Failed to generate address:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="max-w-xl mx-auto p-6 bg-white/80 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl space-y-4 text-gray-900"
    >
      <EmployeeData form={form} employee={employee} />

      <CustomerInformation form={form} onChange={onChange} />

      <LocationAndAddress
        form={form}
        gpsAccuracy={gpsAccuracy}
        isFieldAgent={isFieldAgent}
        getLocation={getLocation}
        generateAddress={generateAddress}
        onChange={onChange}
      />

      <ServiceDetails form={form} onChange={onChange} />

      {(errors.length > 0 || localErrors.length > 0) && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded space-y-1">
          {[...errors, ...localErrors].map((e, i) => (
            <div key={i}>• {e}</div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || cooldownLeft > 0}
        className={`w-full p-2 rounded font-semibold ${
          submitting || cooldownLeft > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        {submitting ? "Submitting..." : cooldownLeft > 0 ? `Wait ${cooldownLeft}s` : "Submit"}
      </button>
    </form>
  );
};
