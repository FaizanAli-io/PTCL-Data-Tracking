"use client";

import { useState } from "react";
import { Map } from "./components/Map";
import { EmployeeData } from "./components/EmployeeData";
import { ServiceDetails } from "./components/ServiceDetails";
import { CustomerInformation } from "./components/CustomerInformation";
import { DisabledInput, InputBox } from "./components/InputBox";

export const BaseForm = ({
  form,
  errors,
  onChange,
  onSubmit,
  employee,
  isFieldAgent
}: {
  form: any;
  errors: string[];
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  employee: any;
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
      <EmployeeData employee={employee} />

      <h2 className="text-lg font-semibold mt-4 text-gray-700">Customer Information</h2>
      <CustomerInformation form={form} onChange={onChange} />

      {isFieldAgent && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <DisabledInput label="* Latitude" value={form.customerLatitude} />
            <DisabledInput label="* Longitude" value={form.customerLongitude} />
            <DisabledInput label="Accuracy (m)" value={gpsAccuracy} />
          </div>

          <button
            type="button"
            onClick={getLocation}
            className="w-full p-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold"
          >
            Get Location
          </button>

          <div className="flex gap-2 items-end">
            <div className="w-[75%]">
              <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700">
                * Address
              </label>
              <input
                id="customerAddress"
                type="text"
                value={form.customerAddress}
                onChange={(e) => onChange("customerAddress", e.target.value)}
                className="mt-1 block w-full rounded-md bg-white text-gray-900 border border-gray-300 placeholder-gray-400 shadow-inner focus:ring-blue-500 focus:border-blue-500 h-[42px]"
              />
            </div>
            <button
              type="button"
              onClick={generateAddress}
              disabled={!form.customerLatitude || !form.customerLongitude}
              className={`p-2 h-[42px] rounded w-[25%] font-semibold transition ${
                !form.customerLatitude || !form.customerLongitude
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              Find Address
            </button>
          </div>

          <Map lat={form.customerLatitude} lng={form.customerLongitude} />
        </>
      )}

      {!isFieldAgent && (
        <InputBox
          id="customerAddress"
          type="text"
          label="Address"
          value={form.customerAddress}
          onChange={(e) => onChange("customerAddress", e.target.value)}
        />
      )}

      <h2 className="text-lg font-semibold mt-4 text-gray-700">Customer Service Details</h2>
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
        className="w-full p-2 bg-green-600 hover:bg-green-500 text-white rounded font-semibold"
      >
        Submit
      </button>
    </form>
  );
};
