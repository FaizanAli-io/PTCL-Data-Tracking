"use client";

import { useState } from "react";
import { BaseForm } from "./BaseForm";
import { useFormState } from "./hooks/useFormState";

export default function MainForm() {
  const [epiLast4, setEpiLast4] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [employee, setEmployee] = useState<any>(null);

  const fsaInitial = {
    customerName: "",
    customerMobile: "",
    customerPSTN: "",
    customerAddress: "",
    customerLatitude: "",
    customerLongitude: "",
    currentInternetProvider: "",
    currentInternetPrice: "",
    reason: "",
    remarks: ""
  };

  const tsaInitial = {
    customerName: "",
    customerMobile: "",
    customerPSTN: "",
    customerAddress: "",
    currentInternetProvider: "",
    currentInternetPrice: "",
    reason: "",
    remarks: ""
  };

  const fsaState = useFormState(fsaInitial);
  const tsaState = useFormState(tsaInitial);

  const isValid = () => {
    const errs: string[] = [];

    if (form.customerPSTN && !/^021\d{7}$/.test(form.customerPSTN))
      errs.push("Invalid PSTN (must start with 021 and have 10 digits).");

    if (!/^03\d{9}$/.test(form.customerMobile))
      errs.push("Invalid mobile number (must start with 03 and have 11 digits).");

    if (!form.currentInternetProvider.trim()) errs.push("Current internet provider is required.");

    if (!form.currentInternetPrice.trim()) errs.push("Current internet price is required.");

    if (!form.customerAddress.trim()) errs.push("Customer address is required.");

    if (!form.customerName.trim()) errs.push("Customer name is required.");

    if (!form.reason.trim()) errs.push("Reason is required.");

    setErrors(errs);
    return errs.length === 0;
  };

  const submit = async () => {
    if (!isValid()) return;

    const isFSA = employee.role === "FSA";
    const form = isFSA ? fsaState.form : tsaState.form;

    const body = {
      ...form,
      epi: parseInt(employee.epi),
      currentInternetPrice: form.currentInternetPrice
        ? parseInt(form.currentInternetPrice.replace(/\D/g, ""))
        : null,
      ...(isFSA && {
        customerLatitude: parseFloat(form.customerLatitude),
        customerLongitude: parseFloat(form.customerLongitude)
      })
    };

    await fetch(`/api/form/${isFSA ? "fsa" : "tsa"}`, {
      method: "POST",
      body: JSON.stringify(body)
    });
    isFSA ? fsaState.reset() : tsaState.reset();
    window.scrollTo(0, 0);
    setSubmitted(true);
  };

  const getEmployeeData = async () => {
    const res = await fetch(`/api/employee/${epiLast4}`);
    if (res.ok) {
      const data = await res.json();
      setEmployee(data);
      setSubmitted(false);
    }
  };

  if (!employee)
    return (
      <div className="max-w-md mx-auto mt-10 space-y-4">
        <input
          type="text"
          placeholder="Enter Last 4 digits of EPI"
          value={epiLast4}
          onChange={(e) => setEpiLast4(e.target.value)}
          className="p-2 border w-full rounded"
        />
        <button onClick={getEmployeeData} className="w-full p-2 bg-blue-600 text-white rounded">
          Fetch Employee Data
        </button>
      </div>
    );

  const isFieldAgent = employee.role === "FSA";
  const { form, onChange } = isFieldAgent ? fsaState : tsaState;

  return (
    <BaseForm
      form={form}
      errors={errors}
      onSubmit={submit}
      onChange={onChange}
      employee={employee}
      isFieldAgent={isFieldAgent}
    />
  );
}
