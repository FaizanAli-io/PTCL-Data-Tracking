import { InputBox } from "./InputBox";

export const ServiceDetails = ({ form, onChange }: any) => (
  <>
    {[
      { name: "currentInternetProvider", placeholder: "Current ISP" },
      { name: "currentInternetPrice", placeholder: "Rs. XXXX (Monthly Price)" },
      { name: "reason", placeholder: "Reason for Decline" },
      { name: "remarks", placeholder: "Remarks (Optional)" }
    ].map(({ name, placeholder }) => (
      <div className="mb-4" key={name}>
        <InputBox
          type="text"
          placeholder={placeholder}
          value={form[name]}
          onChange={(e) => onChange(name, e.target.value)}
        />
      </div>
    ))}
  </>
);
