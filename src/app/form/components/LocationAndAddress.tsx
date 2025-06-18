import { Map } from "./Map";
import { DisabledInput, InputBox } from "./InputBox";

type Props = {
  form: any;
  gpsAccuracy: string;
  isFieldAgent: boolean;
  getLocation: () => void;
  generateAddress: () => void;
  onChange: (key: string, value: any) => void;
};

export const LocationAndAddress = ({
  form,
  gpsAccuracy,
  isFieldAgent,
  getLocation,
  generateAddress,
  onChange
}: Props) => {
  if (isFieldAgent) {
    return (
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
    );
  }

  return (
    <InputBox
      id="customerAddress"
      type="text"
      label="Address"
      value={form.customerAddress}
      onChange={(e) => onChange("customerAddress", e.target.value)}
    />
  );
};
