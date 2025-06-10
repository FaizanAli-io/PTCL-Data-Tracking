import { InputBox } from "./InputBox";

export const ServiceDetails = ({ form, onChange }: any) => (
  <>
    {[
      { name: "currentInternetProvider", label: "Current ISP" },
      { name: "currentInternetPrice", label: "Rs. XXXX (Monthly Price)" },
      { name: "reason", label: "Reason for Decline" },
      { name: "remarks", label: "Remarks (Optional)" }
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
