import { Form, FormSubmission } from "@/types";

const STORAGE_KEY = "form_builder_forms";

export function getForms(): Form[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveForm(form: Form): void {
  const forms = getForms();
  const idx = forms.findIndex((f) => f.id === form.id);
  if (idx >= 0) forms[idx] = form;
  else forms.push(form);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function getFormById(id: string): Form | undefined {
  return getForms().find((f) => f.id === id);
}

export function deleteForm(id: string): void {
  const forms = getForms().filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function addSubmission(formId: string, data: Record<string, unknown>): void {
  const forms = getForms();
  const form = forms.find((f) => f.id === formId);
  if (!form) return;
  const submission: FormSubmission = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    data,
  };
  form.submissions.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
}

export function generateId(): string {
  return crypto.randomUUID();
}