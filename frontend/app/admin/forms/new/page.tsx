"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/types";
import { createForm } from "@/lib/api";
import FieldEditor from "@/components/FieldEditor";

function generateId() { return crypto.randomUUID(); }

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const addField = () => {
    setFields([...fields, { id: generateId(), name: "", type: "text", label: "", required: false }]);
  };

  const updateField = (idx: number, field: FormField) => {
    const updated = [...fields];
    updated[idx] = field;
    setFields(updated);
  };

  const deleteField = (idx: number) => setFields(fields.filter((_, i) => i !== idx));

  const moveField = (idx: number, dir: "up" | "down") => {
    const updated = [...fields];
    const target = dir === "up" ? idx - 1 : idx + 1;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    setFields(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) { setError("Form title is required."); return; }
    if (fields.length === 0) { setError("Add at least one field."); return; }
    for (const f of fields) {
      if (!f.label.trim()) { setError("All fields must have a label."); return; }
      if (!f.name.trim()) { setError(`Field "${f.label}" has an invalid name. Try editing the label.`); return; }
    }
    try {
      setSaving(true);
      setError("");
      await createForm({ title: title.trim(), description: description.trim(), fields });
      router.push("/admin");
    } catch {
      setError("Failed to save form. Check that your FastAPI server is running.");
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/admin" style={{ color: "#6b7280", fontSize: 14 }}>← Back</Link>
            <span style={{ color: "#d1d5db" }}>|</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Create New Form</span>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving..." : "Save Form"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px" }}>
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 16px", borderRadius: 8, marginBottom: 20, fontSize: 14 }}>{error}</div>}

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, color: "#374151" }}>Form Details</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Form Title *</label>
            <input value={title} onChange={(e) => { setTitle(e.target.value); setError(""); }} style={inputStyle} placeholder="e.g. Event Registration Form" />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} placeholder="Brief description of this form" />
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 15, color: "#374151" }}>Fields ({fields.length})</h2>
            <button onClick={addField} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 6, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              + Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 24px", color: "#9ca3af", border: "2px dashed #e5e7eb", borderRadius: 8 }}>
              <p style={{ marginBottom: 12 }}>No fields yet. Add your first field.</p>
              <button onClick={addField} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Field</button>
            </div>
          ) : (
            fields.map((field, idx) => (
              <FieldEditor
                key={field.id}
                field={field}
                index={idx}
                onChange={(f) => updateField(idx, f)}
                onDelete={() => deleteField(idx)}
                onMoveUp={() => moveField(idx, "up")}
                onMoveDown={() => moveField(idx, "down")}
                isFirst={idx === 0}
                isLast={idx === fields.length - 1}
              />
            ))
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
          <Link href="/admin"><button style={outlineBtn}>Cancel</button></Link>
          <button onClick={handleSave} disabled={saving} style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving..." : "Save Form"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box", background: "#f9fafb" };
const primaryBtn: React.CSSProperties = { background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "9px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 7, padding: "9px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" };