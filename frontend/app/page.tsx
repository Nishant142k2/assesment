"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Form } from "@/types";
import { getForms, deleteForm } from "@/lib/api";

export default function AdminDashboard() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getForms();
      setForms(data);
    } catch {
      setError("Could not reach the server. Is FastAPI running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this form and all its submissions?")) return;
    try {
      await deleteForm(id);
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch {
      alert("Failed to delete form.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#2563eb", letterSpacing: "-0.5px" }}>FormCraft</span>
            <span style={{ fontSize: 12, background: "#dbeafe", color: "#1d4ed8", borderRadius: 99, padding: "2px 8px", fontWeight: 600 }}>Admin</span>
          </div>
          <Link href="/admin/forms/new">
            <button style={primaryBtn}>+ New Form</button>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>All Forms</h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>
          {loading ? "Loading..." : `${forms.length} form${forms.length !== 1 ? "s" : ""} total`}
        </p>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "#9ca3af" }}>Loading forms...</div>
        ) : forms.length === 0 && !error ? (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "#9ca3af" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <p style={{ fontSize: 16 }}>No forms yet. Create your first one!</p>
            <Link href="/admin/forms/new"><button style={{ ...primaryBtn, marginTop: 20 }}>+ New Form</button></Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {forms.map((form) => (
              <FormCard key={form.id} form={form} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormCard({ form, onDelete }: { form: Form; onDelete: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/forms/${form.id}` : `/forms/${form.id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{form.title}</h2>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{form.description || "No description"}</p>
      </div>
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#9ca3af" }}>
        <span>📝 {form.fields.length} fields</span>
        <span>🗓 {new Date(form.created_at).toLocaleDateString()}</span>
      </div>

      {/* Shareable URL row */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 10px" }}>
        <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>🔗</span>
        <span style={{ fontSize: 12, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shareUrl}</span>
        <button
          onClick={handleCopy}
          style={{ flexShrink: 0, background: copied ? "#dcfce7" : "#eff6ff", color: copied ? "#16a34a" : "#2563eb", border: "none", borderRadius: 5, padding: "3px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link href={`/forms/${form.id}`} target="_blank">
          <button style={outlineBtn("green")}>↗ Open Form</button>
        </Link>
        <Link href={`/admin/forms/${form.id}/edit`}>
          <button style={outlineBtn("blue")}>✏️ Edit</button>
        </Link>
        <Link href={`/admin/forms/${form.id}/submissions`}>
          <button style={outlineBtn("purple")}>📊 Submissions</button>
        </Link>
        <button onClick={() => onDelete(form.id)} style={outlineBtn("red")}>🗑 Delete</button>
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = { background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "9px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer" };
function outlineBtn(color: string): React.CSSProperties {
  const colors: Record<string, string> = { green: "#16a34a", blue: "#2563eb", purple: "#7c3aed", red: "#dc2626" };
  return { background: "#fff", color: colors[color], border: `1px solid ${colors[color]}20`, borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" };
}