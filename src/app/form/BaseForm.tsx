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
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        onChange("customerLatitude", coords.latitude.toString());
        onChange("customerLongitude", coords.longitude.toString());
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

  const handleMarkerDrag = (lat: number, lng: number) => {
    onChange("customerLatitude", lat.toString());
    onChange("customerLongitude", lng.toString());
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="max-w-xl mx-auto p-6 bg-white shadow rounded-md space-y-4"
    >
      <EmployeeData employee={employee} />

      <h2 className="text-lg font-semibold mt-4 text-gray-900">Customer Information</h2>
      <CustomerInformation form={form} onChange={onChange} />

      {isFieldAgent && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <DisabledInput label="Latitude" value={form.customerLatitude} />
            <DisabledInput label="Longitude" value={form.customerLongitude} />
          </div>

          <button
            type="button"
            onClick={getLocation}
            className="w-full p-2 bg-gray-800 text-white hover:bg-gray-600 rounded"
          >
            Get Location
          </button>

          <div className="flex gap-2 items-end">
            <div className="w-[80%]">
              <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="customerAddress"
                type="text"
                value={form.customerAddress}
                onChange={(e) => onChange("customerAddress", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-[42px] text-black"
              />
            </div>
            <button
              type="button"
              onClick={generateAddress}
              disabled={!form.customerLatitude || !form.customerLongitude}
              className={`p-2 h-[42px] rounded w-[20%] ${
                !form.customerLatitude || !form.customerLongitude
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-600"
              }`}
            >
              Generate
            </button>
          </div>

          <Map
            lat={form.customerLatitude}
            lng={form.customerLongitude}
            onPositionChange={handleMarkerDrag}
          />
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

      <h2 className="text-lg font-semibold mt-4 text-gray-900">Customer Service Details</h2>
      <ServiceDetails form={form} onChange={onChange} />

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded space-y-1">
          {errors.map((e, i) => (
            <div key={i}>• {e}</div>
          ))}
        </div>
      )}

      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
};
