"use client";

import { useState } from "react";
import { EmployeeData } from "./components/EmployeeData";
import { ServiceDetails } from "./components/ServiceDetails";
import { LocationAndAddress } from "./components/LocationAndAddress";
import { CustomerInformation } from "./components/CustomerInformation";
import { ServiceStatus } from "./components/ServiceStatusBadge";

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
  const warnThreshold = 1000;
  const stopThreshold = 10000;

  const [gpsAccuracy, setGpsAccuracy] = useState("");
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [localWarnings, setLocalWarnings] = useState<string[]>([]);
  const [gponStatus, setGponStatus] = useState<ServiceStatus>();
  const [xdslStatus, setXdslStatus] = useState<ServiceStatus>();

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setGpsAccuracy(coords.accuracy.toFixed(2));
        onChange("customerLatitude", coords.latitude.toString());
        onChange("customerLongitude", coords.longitude.toString());

        setLocalErrors([]);
        setLocalWarnings([]);
        let errorMessage = "";
        let warningMessage = "";

        if (coords.accuracy > stopThreshold) {
          errorMessage = `Accuracy too poor (>${stopThreshold}m)`;
        } else if (coords.accuracy > warnThreshold) {
          warningMessage = `Accuracy is poor (>${warnThreshold}m), please try for better accuracy`;
        }

        if (errorMessage) setLocalErrors([errorMessage]);
        if (warningMessage) setLocalWarnings([warningMessage]);

        const route = `/api/network?lat=${coords.latitude}&lng=${coords.longitude}&threshold=5000&limit=1&type=`;

        setGponStatus({ loading: true });
        setXdslStatus({ loading: true });

        const [gponData, xdslData] = await Promise.all([
          fetch(route + "GPON").then((res) => res.json()),
          fetch(route + "XDSL").then((res) => res.json())
        ]);

        setGponStatus(
          gponData.FDH && gponData.FDH.length > 0
            ? { available: true, loading: false, distance: gponData.FDH[0].distance }
            : { available: false, loading: false }
        );

        setXdslStatus(
          xdslData.DC && xdslData.DC.length > 0
            ? { available: true, loading: false, distance: xdslData.DC[0].distance }
            : { available: false, loading: false }
        );
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
        if (localErrors.length === 0) onSubmit();
      }}
      className="max-w-xl mx-auto p-6 bg-white/80 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl space-y-4 text-gray-900"
    >
      <EmployeeData form={form} employee={employee} />

      <CustomerInformation form={form} onChange={onChange} />

      <LocationAndAddress
        form={form}
        gponStatus={gponStatus}
        xdslStatus={xdslStatus}
        gpsAccuracy={gpsAccuracy}
        localErrors={localErrors}
        isFieldAgent={isFieldAgent}
        localWarnings={localWarnings}
        getLocation={getLocation}
        generateAddress={generateAddress}
        onChange={onChange}
      />

      <ServiceDetails form={form} onChange={onChange} />

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded space-y-1">
          {errors.map((e, i) => (
            <div key={i}>• {e}</div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || cooldownLeft > 0 || localErrors.length > 0}
        className={`w-full p-2 rounded font-semibold ${
          submitting || cooldownLeft > 0 || localErrors.length > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-500 text-white"
        }`}
      >
        {submitting ? "Submitting..." : cooldownLeft > 0 ? `Wait ${cooldownLeft}s` : "Submit"}
      </button>
    </form>
  );
};
