"use client";
import { useState } from "react";
import { Form, FormField } from "@/types";

interface Props {
  form: Form;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export default function FormRenderer({ form, onSubmit }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const setValue = (id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const toggleCheckbox = (id: string, option: string) => {
    const current = (values[id] as string[]) ?? [];
    const updated = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
    setValue(id, updated);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    for (const field of form.fields) {
      if (field.required) {
        const val = values[field.id];
        if (!val || (Array.isArray(val) && val.length === 0) || val === "") {
          errs[field.id] = "This field is required.";
        }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      setSubmitError("");
      await onSubmit(values);
      setSubmitted(true);
    } catch {
      setSubmitError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Response Submitted!</h2>
        <p style={{ color: "#6b7280", marginTop: 8, marginBottom: 24 }}>Your response has been recorded.</p>
        <button onClick={() => { setSubmitted(false); setValues({}); setErrors({}); setSubmitError(""); }} style={primaryBtn}>
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div>
      {form.fields.map((field) => (
        <div key={field.id} style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#111" }}>
            {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
          </label>
          {renderField(field, values, setValue, toggleCheckbox)}
          {errors[field.id] && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors[field.id]}</p>}
        </div>
      ))}
      {submitError && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 7, fontSize: 13, marginBottom: 12 }}>
          ⚠️ {submitError}
        </div>
      )}
      <button onClick={handleSubmit} disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.6 : 1, marginTop: 8 }}>
        {submitting ? "Submitting..." : "Submit Response"}
      </button>
    </div>
  );
}

function renderField(
  field: FormField,
  values: Record<string, unknown>,
  setValue: (id: string, v: unknown) => void,
  toggleCheckbox: (id: string, option: string) => void
) {
  const base: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box", background: "#f9fafb" };

  switch (field.type) {
    case "textarea":
      return <textarea rows={4} value={(values[field.id] as string) ?? ""} onChange={(e) => setValue(field.id, e.target.value)} placeholder={field.placeholder} style={{ ...base, resize: "vertical" }} />;
    case "select":
      return (
        <select value={(values[field.id] as string) ?? ""} onChange={(e) => setValue(field.id, e.target.value)} style={base}>
          <option value="">— Select —</option>
          {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    case "radio":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {field.options?.map((o) => (
            <label key={o} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input type="radio" name={field.id} value={o} checked={values[field.id] === o} onChange={() => setValue(field.id, o)} />
              {o}
            </label>
          ))}
        </div>
      );
    case "checkbox":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {field.options?.map((o) => (
            <label key={o} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input type="checkbox" checked={((values[field.id] as string[]) ?? []).includes(o)} onChange={() => toggleCheckbox(field.id, o)} />
              {o}
            </label>
          ))}
        </div>
      );
    case "file":
      return <input type="file" onChange={(e) => setValue(field.id, e.target.files?.[0]?.name ?? "")} style={{ fontSize: 14 }} />;
    case "date":
      return <input type="date" value={(values[field.id] as string) ?? ""} onChange={(e) => setValue(field.id, e.target.value)} style={base} />;
    case "number":
      return <input type="number" value={(values[field.id] as string) ?? ""} onChange={(e) => setValue(field.id, e.target.value)} placeholder={field.placeholder} style={base} />;
    case "email":
      return <input type="email" value={(values[field.id] as string) ?? ""} onChange={(e) => setValue(field.id, e.target.value)} placeholder={field.placeholder} style={base} />;
    default:
      return <input type="text" value={(values[field.id] as string) ?? ""} onChange={(e) => setValue(field.id, e.target.value)} placeholder={field.placeholder} style={base} />;
  }
}

const primaryBtn: React.CSSProperties = { background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "10px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" };