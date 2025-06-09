import { InputBox } from "./InputBox";
import { isValidPhone, isValidPSTN } from "../utils/validation";

export const CustomerInformation = ({ form, onChange }: any) => (
  <>
    {[
      { name: "customerName", placeholder: "Customer Name", type: "text" },
      {
        name: "customerMobile",
        placeholder: "Customer Mobile (03xxxxxxxxx)",
        type: "tel",
        maxLength: 11,
        validator: isValidPhone
      },
      {
        name: "customerPSTN",
        placeholder: "Customer PSTN (Optional, 021xxxxxxx)",
        type: "tel",
        validator: isValidPSTN
      }
    ].map(({ name, placeholder, type, maxLength, validator }) => (
      <div className="mb-4" key={name}>
        <InputBox
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={(e) => onChange(name, e.target.value)}
          maxLength={maxLength}
          className={validator && form[name] && !validator(form[name]) ? "border-red-500" : ""}
        />
      </div>
    ))}
  </>
);
