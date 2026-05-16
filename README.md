# Dynamic Form Builder

A full-stack platform that lets admins create and manage custom forms dynamically — including event registrations, job applications, scholarship applications, and feedback forms. Built as part of a technical assessment.

> 📹 **Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/12FNWuENR6STPUUbwc_mBpU_ynBprVVCF/view?usp=sharing) ← _replace with your link_

---

## Project Structure

```
assessment/
├── frontend/                   # Next.js 14 + TypeScript
│   ├── app/
│   │   ├── admin/              # Admin dashboard & form management
│   │   │   └── forms/
│   │   │       ├── new/        # Create a new form
│   │   │       └── [id]/
│   │   │           ├── edit/         # Edit an existing form
│   │   │           └── submissions/  # View form submissions
│   │   └── forms/
│   │       └── [id]/           # Public participant form page
│   ├── components/
│   │   ├── FieldEditor.tsx     # Per-field configuration panel
│   │   └── FormRenderer.tsx    # Renders live form for participants
│   ├── lib/
│   │   └── api.ts              # All fetch calls to FastAPI backend
│   └── types/
│       └── index.ts            # Shared TypeScript interfaces
│
└── backend/                    # FastAPI + MongoDB
    ├── main.py                 # App entry point, CORS, router registration
    ├── models/
    │   └── forms.py            # Pydantic models (FormField, FormCreate, etc.)
    └── routes/
        ├── forms.py            # CRUD endpoints for forms
        └── submissions.py      # Submission endpoints
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, React 18 |
| Backend | FastAPI, Python |
| Database | MongoDB |
| Styling | Inline styles (no external CSS framework) |
| HTTP Client | Native `fetch` API |

---

## Features

- **Admin Dashboard** — view all forms, copy shareable links, manage submissions
- **Dynamic Form Builder** — add, reorder, and configure fields with 9 field types:
  `text`, `email`, `number`, `date`, `textarea`, `dropdown`, `radio`, `checkbox`, `file upload`
- **Public Form Page** — shareable URL for participants to fill out and submit
- **Submissions Viewer** — table view with per-submission detail panel
- **Validation** — required field enforcement on both frontend and backend (Pydantic)

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally or a connection URI

---

### Backend Setup

```bash
cd assessment/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pymongo python-dotenv

# Create a .env file
echo "MONGO_URI=mongodb://localhost:27017" > .env
echo "DB_NAME=form_builder" >> .env

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
cd assessment/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## API Reference

### Forms

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/forms` | List all forms |
| `POST` | `/forms` | Create a new form |
| `GET` | `/forms/{form_id}` | Get a single form |
| `PUT` | `/forms/{form_id}` | Update a form |
| `DELETE` | `/forms/{form_id}` | Delete a form |

### Submissions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/forms/{form_id}/submissions` | Submit a response |
| `GET` | `/forms/{form_id}/submissions` | Get all submissions for a form |

---

## Usage

1. Open `http://localhost:3000` — redirects to the admin dashboard
2. Click **+ New Form**, add a title and fields, click **Save Form**
3. A shareable link is shown immediately after saving — copy and send it to participants
4. Participants open the link, fill out the form, and submit
5. Back in the admin dashboard, click **📊 Submissions** on any form card to view responses

---

## Environment Variables

### Backend `.env`

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=form_builder
```

---

## Notes

- CORS is configured on the backend to allow requests from `http://localhost:3000`
- Field `name` values are auto-generated from the label (e.g. `"Full Name"` → `"full_name"`) and used as keys in submission data
- No authentication is implemented — this is scoped as an assessment project
