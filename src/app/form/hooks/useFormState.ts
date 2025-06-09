import { useState } from "react";

export const useFormState = (initial: any) => {
  const [form, setForm] = useState(initial);
  const onChange = (name: string, value: string) => setForm((f: any) => ({ ...f, [name]: value }));
  const reset = () => setForm(initial);
  return { form, onChange, reset };
};
