export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "file";

export interface FormField {
  id: string;
  name: string;       // snake_case identifier required by FastAPI — auto-derived from label
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

// ── API response shapes (what FastAPI sends back) ─────────────────────────────

export interface Form {
  id: string;           // FastAPI serializes MongoDB _id → id
  title: string;
  description: string;
  fields: FormField[];
  created_at: string;   // snake_case from Python
}

export interface FormSubmission {
  id: string;
  form_id: string;
  submitted_at: string;
  data: Record<string, unknown>;
}

// ── API request bodies (what we send to FastAPI) ──────────────────────────────

export interface FormCreate {
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormUpdate {
  title: string;
  description: string;
  fields: FormField[];
}

export interface SubmissionCreate {
  data: Record<string, unknown>;
}