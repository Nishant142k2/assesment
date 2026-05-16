const BASE = "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }
  // DELETE returns 204 no content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Forms ────────────────────────────────────────────────────────────────────

export const getForms = () =>
  request<import("@/types").Form[]>("/forms");

export const getFormById = (id: string) =>
  request<import("@/types").Form>(`/forms/${id}`);

export const createForm = (body: import("@/types").FormCreate) =>
  request<import("@/types").Form>("/forms", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateForm = (id: string, body: import("@/types").FormUpdate) =>
  request<import("@/types").Form>(`/forms/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteForm = (id: string) =>
  request<void>(`/forms/${id}`, { method: "DELETE" });

// ── Submissions ───────────────────────────────────────────────────────────────

export const getSubmissions = (formId: string) =>
  request<import("@/types").FormSubmission[]>(`/forms/${formId}/submissions`);

export const createSubmission = (formId: string, body: import("@/types").SubmissionCreate) =>
  request<import("@/types").FormSubmission>(`/forms/${formId}/submissions`, {
    method: "POST",
    body: JSON.stringify(body),
  });