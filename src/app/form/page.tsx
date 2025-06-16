"use client";

import { BaseForm } from "./BaseForm";
import { useFormState } from "./hooks/useFormState";
import { useState, useRef, useEffect } from "react";

export default function MainForm() {
  const [epiLast5, setEpiLast5] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [employee, setEmployee] = useState<any>(null);
  const [isFieldAgent, setFieldAgent] = useState(false);

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

    if (form.customerPSTN && !/^021\d{8}$/.test(form.customerPSTN))
      errs.push("Invalid PSTN (must start with 021 and have 11 digits).");

    if (form.customerMobile && !/^03\d{9}$/.test(form.customerMobile))
      errs.push("Invalid mobile number (must start with 03 and have 11 digits).");

    // if (!form.reason.trim()) errs.push("Reason is required.");

    if (!form.customerName.trim()) errs.push("Customer name is required.");

    if (!form.customerAddress.trim()) errs.push("Customer address is required.");

    // if (!form.currentInternetProvider.trim()) errs.push("Current internet provider is required.");

    setErrors(errs);
    return errs.length === 0;
  };

  const submit = async () => {
    if (!isValid()) return;

    const form = isFieldAgent ? fsaState.form : tsaState.form;

    const body = {
      ...form,
      epi: employee.epi,
      currentInternetPrice: form.currentInternetPrice
        ? parseInt(form.currentInternetPrice.replace(/\D/g, ""))
        : null,
      ...(isFieldAgent && {
        customerLatitude: parseFloat(form.customerLatitude),
        customerLongitude: parseFloat(form.customerLongitude)
      })
    };

    await fetch(`/api/form/${isFieldAgent ? "fsa" : "tsa"}`, {
      method: "POST",
      body: JSON.stringify(body)
    });

    setEmployee({ ...employee, entryCount: employee.entryCount + 1 });
    isFieldAgent ? fsaState.reset() : tsaState.reset();
    window.scrollTo(0, 0);
    setSubmitted(true);
  };

  const [error, setError] = useState("");

  const getEmployeeData = async () => {
    try {
      if (epiLast5.length !== 5 || !/^\d+$/.test(epiLast5)) {
        setError("Please enter a valid 5 digit number");
        return;
      }

      const res = await fetch(`/api/employee/${epiLast5}`);
      if (res.ok) {
        const data = await res.json();
        setError("");
        setEmployee(data);
        setSubmitted(false);
        setFieldAgent(["FSA", "FFO", "MGT"].includes(data.role));
      } else if (res.status === 404) {
        setError(`Employee (${epiLast5}) not found. Please check the EPI number and try again.`);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch employee data. Please try again.");
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setSubmitted(false);
      }
    };

    if (submitted) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [submitted]);

  if (!employee) {
    return (
      <div className="max-w-md mx-auto mt-10 space-y-4">
        <input
          type="text"
          placeholder="Enter Last 5 digits of EPI"
          value={epiLast5}
          onChange={(e) => {
            setEpiLast5(e.target.value);
            setError("");
          }}
          className="p-2 border w-full rounded"
        />

        <button
          onClick={getEmployeeData}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fetch Employee Data
        </button>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
        )}
      </div>
    );
  }

  const { form, onChange } = isFieldAgent ? fsaState : tsaState;

  return (
    <>
      {submitted && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-6 max-w-md w-full text-center shadow-2xl space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800">Thank you for your submission!</h2>
            <p className="text-gray-600">
              You have submitted <span className="font-bold">{employee.entryCount}</span>{" "}
              {employee.entryCount === 1 ? "entry" : "entries"} today.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500"
              onClick={() => setSubmitted(false)}
            >
              Submit Again
            </button>
          </div>
        </div>
      )}

      <BaseForm
        form={form}
        errors={errors}
        onSubmit={submit}
        onChange={onChange}
        employee={employee}
        isFieldAgent={isFieldAgent}
      />
    </>
  );
}
