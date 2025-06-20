"use client";

import { BaseForm } from "./BaseForm";
import { useFormState } from "./hooks/useFormState";
import { useState, useRef, useEffect } from "react";

export default function MainForm() {
  const [epiLast5, setEpiLast5] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [employee, setEmployee] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isFieldAgent, setFieldAgent] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);

  const fsaInitial = {
    type: "DDS",
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

    if (!isFieldAgent && !form.customerPSTN && !form.customerMobile) {
      errs.push("Either Mobile Number or PSTN must be provided.");
    }

    if (form.customerPSTN && !/^021\d{8}$/.test(form.customerPSTN))
      errs.push("Invalid PSTN (must start with 021 and have 11 digits).");

    if (form.customerMobile && !/^03\d{9}$/.test(form.customerMobile))
      errs.push("Invalid Mobile Number (must start with 03 and have 11 digits).");

    // if (!form.reason.trim()) errs.push("Reason is required.");

    if (!form.customerName.trim()) errs.push("Customer name is required.");

    if (!form.customerAddress.trim()) errs.push("Customer address is required.");

    // if (!form.currentInternetProvider.trim()) errs.push("Current internet provider is required.");

    setErrors(errs);
    return errs.length === 0;
  };

  const submit = async () => {
    if (!isValid() || submitting || cooldownLeft > 0) return;

    const now = Date.now();
    const form = isFieldAgent ? fsaState.form : tsaState.form;
    const cooldown = isFieldAgent && form.type === "DDS" ? 60_000 : 30_000;

    if (shouldCooldown(now, cooldown)) return;

    setSubmitting(true);
    setErrors([]);

    try {
      const res = await fetch(`/api/form/${isFieldAgent ? "fsa" : "tsa"}`, {
        body: JSON.stringify(preparePayload(form)),
        method: "POST"
      });

      const result = await res.json();

      if (!res.ok) return handleError(result.error);

      setEmployee({ ...employee, entryCount: result.entryCount });
      setLastSubmissionTime(now);

      if (isFieldAgent) {
        const { type } = form;
        fsaState.reset();
        fsaState.onChange("type", type);
      } else {
        tsaState.reset();
      }

      setSubmitted(true);
      window.scrollTo(0, 0);
      startCooldown(cooldown);
    } catch {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  const shouldCooldown = (now: number, cooldown: number) => {
    if (!lastSubmissionTime || now - lastSubmissionTime >= cooldown) return false;
    const secondsLeft = Math.ceil((cooldown - (now - lastSubmissionTime)) / 1000);
    setErrors([`Please wait ${secondsLeft} seconds.`]);
    setCooldownLeft(secondsLeft);
    startCooldownTimer();
    return true;
  };

  const preparePayload = (form: any) => ({
    ...form,
    epi: employee.epi,
    currentInternetPrice: form.currentInternetPrice
      ? parseInt(form.currentInternetPrice.replace(/\D/g, ""))
      : null,
    ...(isFieldAgent && {
      customerLatitude: parseFloat(form.customerLatitude),
      customerLongitude: parseFloat(form.customerLongitude)
    })
  });

  const handleError = (msg?: string) => {
    setErrors([msg || "Submission failed."]);
    setSubmitting(false);
  };

  const startCooldown = (ms: number) => {
    const seconds = ms / 1000;
    setCooldownLeft(seconds);
    startCooldownTimer();
  };

  const startCooldownTimer = () => {
    const interval = setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

  const { form, onChange } = isFieldAgent ? fsaState : tsaState;

  return (
    <div className="relative z-20">
      {employee ? (
        <>
          {submitted && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div
                ref={modalRef}
                className="bg-white rounded-xl p-6 max-w-md w-full text-center shadow-2xl space-y-4 text-gray-800"
              >
                <h2 className="text-2xl font-semibold">Thank you for your submission!</h2>
                <p>
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
            submitting={submitting}
            cooldownLeft={cooldownLeft}
            isFieldAgent={isFieldAgent}
          />
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl space-y-4">
            <input
              type="text"
              placeholder="Enter Last 5 digits of EPI"
              value={epiLast5}
              onChange={(e) => {
                setEpiLast5(e.target.value);
                setError("");
              }}
              className="p-3 w-full rounded bg-white/20 text-white placeholder:text-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={getEmployeeData}
              className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Fetch Employee Data
            </button>
            {error && (
              <div className="p-3 bg-red-200 text-red-800 rounded text-sm border border-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
