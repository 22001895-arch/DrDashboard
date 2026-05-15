# Emergency Department Doctor Interface

A React + TypeScript interface for Emergency Department Green Zone queue monitoring and triage-first workflows.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## Overview

This application helps clinicians:

- review the active queue in real time
- prioritize red-flag patients quickly
- open a dedicated detail screen for each patient
- track and update consultation status
- review/edit/copy AI clinical summary text
- **Doctor Authentication**: Secure login system to track clinical actions
- **Consultation Ownership**: Records which doctor is seeing which patient

## Current Features

### Authentication & Security
- **Secure Login**: Doctors must log in to access the dashboard.
- **Session Persistence**: Login state is saved across browser refreshes.
- **Logout**: Safe session termination.

### Queue and Prioritization

- Auto-sorted queue (priority/red-flag/status/time)
- **Doctor Ownership**: Displays the name of the assigned doctor in the queue.
- Red-flag highlighting in list and detail views
- One-click actions:
  - `Attend First` (priority bump + assigned to current Dr)
  - `Mark Not Urgent` (manual red-flag override)
- Status flow:
  - `Waiting`
  - `In Progress`
  - `Completed`

### Live Operations

- Auto-refresh every 30 seconds
- Manual refresh button
- Last-updated indicator
- Error banner with retry action

### Patient Detail Workspace

- Dedicated detail view per patient
- Demographics, arrival metrics, triage zone, and complaints
- **Mock Vitals Integration**: Real-time vital signs display (BP, HR, SpO2, Temp, Resp)
- **Clinical History Formatting**: Parsed and structured patient symptom and comorbidity history
- **Standalone Red Flag Causes**: Prominent visual extraction of critical alerts
- AI clinical summary editor with:
  - edit/confirm/cancel
  - copy to clipboard (`Validate & Copy`)
- Optional notes and additional details rendering

### Dashboard Visibility

- Queue statistics cards
- New red-flag alert banners
- Empty and loading states

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
cd MockEMR2
npm install
npm run dev
```

Development server: `http://localhost:3000`

### Build and Preview

```bash
npm run build
npm run preview
```

## Scripts

```bash
npm install      # Install dependencies
npm run dev      # Vite dev server
npm run build    # TypeScript compile + production build
npm run preview  # Preview production build
npm run lint     # ESLint checks
```

## Setup Instructions

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/DoctorDashboard.git
cd DoctorDashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and set your API endpoint
# VITE_API_BASE_URL=http://localhost:3000/api
# or your production server URL
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Test the production build locally
```

## Environment Variables

Configure these in `.env.local` (copy from `.env.example`):

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `http://localhost:3000/api` |
| `VITE_REFRESH_INTERVAL` | Auto-refresh interval in ms | `30000` |
| `VITE_MAX_RETRY_ATTEMPTS` | API retry attempts | `3` |

**Note:** `.env.local` is ignored by git. Each developer/environment should have their own.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- React Context API (state management)

## Project Structure

```text
MockEMR2/
├── src/
│   ├── components/
│   │   ├── AlertBanner.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingState.tsx
│   │   ├── LoginPage.tsx
│   │   ├── PatientCard.tsx
│   │   ├── PatientDetailView.tsx
│   │   ├── PatientRow.tsx
│   │   └── QueueStats.tsx
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── parser.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
├── ARCHITECTURE.md
├── DELIVERY_SUMMARY.md
├── DEPLOYMENT.md
├── DOCTOR_GUIDE.md
└── README.md
```

## API Integration

The application communicates with a backend API to fetch patient data and track clinical actions.

**Base URL Resolution:**
- Uses `VITE_API_BASE_URL` environment variable if set
- Fallback: `http://localhost:5000/api` (standard backend port)

**Endpoints:**
```http
POST /api/auth/login                         # Authenticate staff
GET  /api/view                               # Fetch queue from v_patient_queue
POST /api/patient/:id/start-consultation     # Assign doctor to patient
POST /api/patient/:id/override-redflag       # Manual red-flag clearance
```

**Security:**
The dashboard uses the `VITE_HOSPITAL_API_KEY` in the `x-api-key` header for all write operations to ensure authorized access.

Example item shape:

```ts
{
  id: 62,
  complaints: "[\"Fever\"]",
  details: "{...}",
  ai_summary: "...",
  seen_by_doctor_name: "Dr. Rahman",
  triage_zone: "YELLOW",
  red_flag: "NO",
  created_at: "2026-01-13 04:22:41"
}
```

Note: `complaints` and `details` arrive as JSON strings and are parsed by `src/services/parser.ts`.

## Configuration

Create a `.env` file if needed:

```env
VITE_API_BASE_URL=https://your-api-url.dev/api
```

Refresh interval can be adjusted in `src/context/AppContext.tsx` (currently `30000` ms).

## Validation and Quality

```bash
npm run lint
npm run build
```

`npm run build` includes TypeScript compilation before bundling.

## Troubleshooting

### API fetch fails

- Verify `VITE_API_BASE_URL`
- Check endpoint availability and CORS/network conditions

### Queue does not update

- Confirm auto-refresh is ON in header
- Use manual refresh

### Data parse warnings

- Inspect browser console for malformed records
- Parser skips invalid records and continues rendering valid entries

## Additional Docs

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [IMPLEMENTATION.md](IMPLEMENTATION.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [DOCTOR_GUIDE.md](DOCTOR_GUIDE.md)
- [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)

---

Version: 1.0.0
Last Updated: April 12, 2026
