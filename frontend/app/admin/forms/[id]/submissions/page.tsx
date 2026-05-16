"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Form, FormSubmission } from "@/types";
import { getFormById, getSubmissions } from "@/lib/api";

export default function SubmissionsPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selected, setSelected] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getFormById(id), getSubmissions(id)])
      .then(([f, subs]) => {
        setForm(f);
        setSubmissions(subs);
      })
      .catch(() => setError("Failed to load data. Is your FastAPI server running?"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center", color: "#dc2626" }}>{error}</div>;
  if (!form) return <div style={{ padding: 40, textAlign: "center" }}>Form not found. <Link href="/admin" style={{ color: "#2563eb" }}>Go back</Link></div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/admin" style={{ color: "#6b7280", fontSize: 14 }}>← Back</Link>
            <span style={{ color: "#d1d5db" }}>|</span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Submissions — {form.title}</span>
          </div>
          <span style={{ fontSize: 13, color: "#6b7280" }}>{submissions.length} total</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px", display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 24 }}>
        <div>
          {submissions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: "#9ca3af", background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p>No submissions yet.</p>
              <Link href={`/forms/${form.id}`} target="_blank">
                <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "9px 20px", fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 16 }}>
                  Open Form Link
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={th}>#</th>
                    <th style={th}>Submitted</th>
                    {form.fields.slice(0, 3).map((f) => <th key={f.name} style={th}>{f.label}</th>)}
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => (
                    <tr key={sub.id} style={{ borderBottom: "1px solid #f1f5f9", background: selected?.id === sub.id ? "#eff6ff" : "transparent" }}>
                      <td style={td}>{i + 1}</td>
                      <td style={td}>{new Date(sub.submitted_at).toLocaleString()}</td>
                      {form.fields.slice(0, 3).map((f) => (
                        <td key={f.name} style={{ ...td, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {Array.isArray(sub.data[f.name]) ? (sub.data[f.name] as string[]).join(", ") : String(sub.data[f.name] ?? "—")}
                        </td>
                      ))}
                      <td style={td}>
                        <button onClick={() => setSelected(selected?.id === sub.id ? null : sub)} style={{ background: "#eff6ff", color: "#2563eb", border: "none", borderRadius: 5, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          {selected?.id === sub.id ? "Close" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selected && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, height: "fit-content" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14 }}>Submission Detail</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>{new Date(selected.submitted_at).toLocaleString()}</p>
            {form.fields.map((f) => (
              <div key={f.name} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: "#111", background: "#f9fafb", padding: "6px 10px", borderRadius: 5, wordBreak: "break-word" }}>
                  {Array.isArray(selected.data[f.name]) ? (selected.data[f.name] as string[]).join(", ") || "—" : String(selected.data[f.name] ?? "—")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12 };
const td: React.CSSProperties = { padding: "10px 16px", color: "#374151" };