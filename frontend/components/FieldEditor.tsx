"use client";
import { FormField, FieldType } from "@/types";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Short Text" },
  { value: "textarea", label: "Long Text" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "file", label: "File Upload" },
];

interface Props {
  field: FormField;
  index: number;
  onChange: (field: FormField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function FieldEditor({ field, index, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: Props) {
  const hasOptions = ["select", "radio", "checkbox"].includes(field.type);

  const handleOptionChange = (idx: number, value: string) => {
    const options = [...(field.options ?? [])];
    options[idx] = value;
    onChange({ ...field, options });
  };

  const addOption = () => onChange({ ...field, options: [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`] });
  const removeOption = (idx: number) => {
    const options = (field.options ?? []).filter((_, i) => i !== idx);
    onChange({ ...field, options });
  };

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "16px", background: "#fff", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Field {index + 1}</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onMoveUp} disabled={isFirst} title="Move up" style={iconBtn("#f1f5f9", isFirst)}>↑</button>
          <button onClick={onMoveDown} disabled={isLast} title="Move down" style={iconBtn("#f1f5f9", isLast)}>↓</button>
          <button onClick={onDelete} title="Delete field" style={iconBtn("#fee2e2")}>✕</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={labelStyle}>Label *</label>
          <input
            value={field.label}
            onChange={(e) => {
              const label = e.target.value;
              const name = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
              onChange({ ...field, label, name });
            }}
            style={inputStyle}
            placeholder="Field label"
          />
        </div>
        <div>
          <label style={labelStyle}>Type *</label>
          <select
            value={field.type}
            onChange={(e) => {
              const newType = e.target.value as FieldType;
              const newHasOptions = ["select", "radio", "checkbox"].includes(newType);
              onChange({ ...field, type: newType, options: newHasOptions ? (field.options ?? ["Option 1"]) : undefined });
            }}
            style={inputStyle}
          >
            {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {!hasOptions && field.type !== "file" && field.type !== "date" && (
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Placeholder</label>
            <input value={field.placeholder ?? ""} onChange={(e) => onChange({ ...field, placeholder: e.target.value })} style={inputStyle} placeholder="Placeholder text" />
          </div>
        )}

        <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" id={`req-${field.id}`} checked={field.required} onChange={(e) => onChange({ ...field, required: e.target.checked })} />
          <label htmlFor={`req-${field.id}`} style={{ fontSize: 13, color: "#374151", cursor: "pointer" }}>Required field</label>
        </div>
      </div>

      {hasOptions && (
        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Options</label>
          {(field.options ?? []).map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder={`Option ${i + 1}`} />
              <button onClick={() => removeOption(i)} style={iconBtn("#fee2e2")}>✕</button>
            </div>
          ))}
          <button onClick={addOption} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, boxSizing: "border-box", background: "#f9fafb" };
function iconBtn(bg: string, disabled?: boolean): React.CSSProperties {
  return { background: bg, border: "none", borderRadius: 5, padding: "5px 10px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, fontSize: 13 };
}