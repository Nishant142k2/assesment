"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Form } from "@/types";
import { getFormById, createSubmission } from "@/lib/api";
import FormRenderer from "@/components/FormRenderer";

export default function PublicFormPage() {
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<Form | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getFormById(id).then(setForm).catch(() => setNotFound(true));
  }, [id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    await createSubmission(id, { data }); // throws on failure → FormRenderer shows error
  };

  if (notFound) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Form not found</h2>
        <p style={{ color: "#6b7280", marginTop: 8 }}>This form may have been deleted or the link is invalid.</p>
      </div>
    </div>
  );

  if (!form) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
      Loading form...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 16px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: "#9ca3af", textAlign: "center" }}>
          Powered by <span style={{ fontWeight: 700, color: "#2563eb" }}>FormCraft</span>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "#2563eb", padding: "28px 32px" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{form.title}</h1>
            {form.description && <p style={{ color: "#bfdbfe", fontSize: 14, lineHeight: 1.6 }}>{form.description}</p>}
          </div>
          <div style={{ padding: "28px 32px" }}>
            <FormRenderer form={form} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}