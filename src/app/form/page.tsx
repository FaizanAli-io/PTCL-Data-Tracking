"use client";

import { useState } from "react";
import { BaseForm } from "./BaseForm";
import { useFormState } from "./hooks/useFormState";

export default function MainForm() {
  const [epiLast4, setEpiLast4] = useState("");
  const [employee, setEmployee] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const fsaInitial = {
    customerName: "",
    customerMobile: "",
    customerPSTN: "",
    customerAddress: "",
    customerLatitude: "",
    customerLongitude: "",
    locationAccuracy: "",
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
    if (!form.customerName.trim()) return false;
    if (!/^03\d{9}$/.test(form.customerMobile)) return false;
    if (form.customerPSTN && !/^021\d{7}$/.test(form.customerPSTN)) return false;
    if (!form.customerAddress.trim()) return false;
    if (!form.currentInternetProvider.trim()) return false;
    if (!form.currentInternetPrice.trim()) return false;
    if (!form.reason.trim()) return false;
    return true;
  };

  const submit = async () => {
    if (!isValid()) return;

    const isFSA = employee.role === "FSA";
    const form = isFSA ? fsaState.form : tsaState.form;
    delete form.locationAccuracy;

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
      employee={employee}
      form={form}
      onChange={onChange}
      onSubmit={submit}
      isFieldAgent={isFieldAgent}
    />
  );
}
