import { InputBox } from "./InputBox";
import { isValidPhone, isValidPSTN } from "../utils/validation";

export const CustomerInformation = ({ form, onChange }: any) => (
  <>
    {[
      { name: "customerName", label: "* Customer Name", type: "text" },
      {
        name: "customerMobile",
        label: "* Customer Mobile (03xxxxxxxxx)",
        type: "tel",
        maxLength: 11,
        validator: isValidPhone
      },
      {
        name: "customerPSTN",
        label: "Customer PSTN (Optional, 021xxxxxxx)",
        type: "tel",
        validator: isValidPSTN
      }
    ].map(({ name, label, type, maxLength, validator }) => (
      <div className="mb-4" key={name}>
        <InputBox
          type={type}
          label={label}
          value={form[name]}
          onChange={(e) => onChange(name, e.target.value)}
          maxLength={maxLength}
          className={validator && form[name] && !validator(form[name]) ? "border-red-500" : ""}
        />
      </div>
    ))}
  </>
);
