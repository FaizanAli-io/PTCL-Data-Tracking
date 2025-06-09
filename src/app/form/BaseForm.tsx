import { EmployeeData } from "./components/EmployeeData";
import { ServiceDetails } from "./components/ServiceDetails";
import { CustomerInformation } from "./components/CustomerInformation";
import { DisabledInput, InputBox } from "./components/InputBox";

export const BaseForm = ({
  employee,
  form,
  onChange,
  onSubmit,
  isFieldAgent
}: {
  employee: any;
  form: any;
  onChange: (name: string, value: string) => void;
  onSubmit: () => void;
  isFieldAgent: boolean;
}) => {
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${process.env.NEXT_PUBLIC_GEOCODING_API_KEY}`
        );
        const address = (await res.json()).results?.[0]?.formatted_address || "";
        onChange("customerLatitude", coords.latitude.toString());
        onChange("customerLongitude", coords.longitude.toString());
        onChange("locationAccuracy", coords.accuracy.toString());
        onChange("customerAddress", address);
      },
      console.error,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
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
          <button
            type="button"
            onClick={getLocation}
            className="w-full p-2 bg-gray-800 text-white rounded"
          >
            Get Location
          </button>
          <InputBox
            type="text"
            placeholder="Address"
            value={form.customerAddress}
            onChange={(e) => onChange("customerAddress", e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            <DisabledInput value={form.customerLatitude} placeholder="Latitude" />
            <DisabledInput value={form.customerLongitude} placeholder="Longitude" />
            <DisabledInput value={form.locationAccuracy} placeholder="Accuracy" />
          </div>
        </>
      )}
      {!isFieldAgent && (
        <InputBox
          type="text"
          placeholder="Address"
          value={form.customerAddress}
          onChange={(e) => onChange("customerAddress", e.target.value)}
        />
      )}
      <h2 className="text-lg font-semibold mt-4 text-gray-900">Service Details</h2>
      <ServiceDetails form={form} onChange={onChange} />
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
};
