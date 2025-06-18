import { InputBox } from "./InputBox";

export const ServiceDetails = ({ form, onChange }: any) => (
  <>
    <h2 className="text-lg font-semibold mt-4 text-gray-700">Customer Service Details</h2>
    {[
      { name: "currentInternetProvider", label: "Current ISP" },
      { name: "currentInternetPrice", label: "Monthly Price" },
      { name: "reason", label: "Reason for Decline" },
      { name: "remarks", label: "Remarks" }
    ].map(({ name, label }) => (
      <div className="mb-4" key={name}>
        <InputBox
          type="text"
          label={label}
          value={form[name]}
          onChange={(e) => onChange(name, e.target.value)}
        />
      </div>
    ))}
  </>
);
