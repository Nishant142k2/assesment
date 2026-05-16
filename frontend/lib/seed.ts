import { Form } from "@/types";

export const SEED_FORMS: Form[] = [
  {
    id: "seed-event-reg",
    title: "Event Registration",
    description: "Register for our upcoming tech conference.",
    createdAt: new Date().toISOString(),
    submissions: [],
    fields: [
      { id: "f1", type: "text", label: "Full Name", placeholder: "John Doe", required: true },
      { id: "f2", type: "email", label: "Email Address", placeholder: "john@example.com", required: true },
      { id: "f3", type: "select", label: "Session Track", required: true, options: ["AI & ML", "Web Dev", "DevOps", "Design"] },
      { id: "f4", type: "radio", label: "T-Shirt Size", required: false, options: ["S", "M", "L", "XL"] },
      { id: "f5", type: "textarea", label: "Dietary Restrictions", placeholder: "Any allergies or preferences?", required: false },
    ],
  },
  {
    id: "seed-job-app",
    title: "Job Application",
    description: "Apply for open positions at our company.",
    createdAt: new Date().toISOString(),
    submissions: [],
    fields: [
      { id: "f1", type: "text", label: "Full Name", placeholder: "Jane Smith", required: true },
      { id: "f2", type: "email", label: "Email", placeholder: "jane@example.com", required: true },
      { id: "f3", type: "text", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/...", required: false },
      { id: "f4", type: "select", label: "Position", required: true, options: ["Frontend Engineer", "Backend Engineer", "Product Manager", "Designer"] },
      { id: "f5", type: "number", label: "Years of Experience", placeholder: "3", required: true },
      { id: "f6", type: "file", label: "Resume (PDF)", required: true },
      { id: "f7", type: "textarea", label: "Cover Letter", placeholder: "Tell us why you're a great fit...", required: false },
    ],
  },
  {
    id: "seed-feedback",
    title: "Feedback Form",
    description: "Share your experience with our product.",
    createdAt: new Date().toISOString(),
    submissions: [],
    fields: [
      { id: "f1", type: "text", label: "Name (optional)", placeholder: "Anonymous", required: false },
      { id: "f2", type: "radio", label: "Overall Rating", required: true, options: ["1 - Poor", "2 - Fair", "3 - Good", "4 - Great", "5 - Excellent"] },
      { id: "f3", type: "checkbox", label: "What did you like?", required: false, options: ["UI/UX", "Performance", "Features", "Support", "Pricing"] },
      { id: "f4", type: "textarea", label: "Additional Comments", placeholder: "Anything else you'd like to share?", required: false },
    ],
  },
  {
    id: "seed-scholarship",
    title: "Scholarship Application",
    description: "Apply for our annual merit-based scholarship program.",
    createdAt: new Date().toISOString(),
    submissions: [],
    fields: [
      { id: "f1", type: "text", label: "Full Name", placeholder: "Your full name", required: true },
      { id: "f2", type: "email", label: "Email", placeholder: "you@university.edu", required: true },
      { id: "f3", type: "text", label: "University / Institution", placeholder: "University name", required: true },
      { id: "f4", type: "select", label: "Year of Study", required: true, options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Masters", "PhD"] },
      { id: "f5", type: "number", label: "GPA / Percentage", placeholder: "8.5", required: true },
      { id: "f6", type: "textarea", label: "Statement of Purpose", placeholder: "Why should you receive this scholarship?", required: true },
      { id: "f7", type: "file", label: "Supporting Documents", required: false },
    ],
  },
];