# OJT Journal Maker - Next.js Migration & Implementation Plan

This document outlines the roadmap for transitioning the OJT Journal Maker from its vanilla HTML/JS implementation to a full-featured **Next.js** web application.

## 🚀 Core Features (To be Replicated)

- **3-Step Wizard Workflow**: A guided experience spanning Upload & Configure, Review, and Generate.
- **AI-Powered Content Generation**: Leveraging Gemini to automate the creation of daily task descriptions.
- **PDF Infrastructure**: Automated filling and customization of PDF templates.
- **Dynamic Scheduling**: Intelligent date handling with support for custom skip dates/holidays.
- **State-of-the-Art UX**: Premium dark theme, real-time progress bars, and micro-animations.

---

## 🏗️ Next.js Migration Strategy

The application will be refactored into a modern React-based architecture using the Next.js App Router:

### Phase 1: Foundational Setup
- **Architecture**: Move from static files to a component-based structure in the `ui` directory.
- **Styling**: Replace custom CSS with **Tailwind CSS**.
- **UI Components**: Integrate **Shadcn UI** or **Radix UI** primitives for high-quality, accessible interactive elements (Steppers, Progress Bars, Dialogs).
- **Global Theme**: Initialize a unified design system in `globals.css` with support for the `#6c63ff` signature accent.

### Phase 2: Form & State Management
- **Wizard Logic**: Implement a client-side state machine using React Hooks (`useState`, `useContext`) to track step progression and form data.
- **Validation**: Use **Zod** schema validation with **react-hook-form** for robust data entry.
- **Advanced Controls**:
  - `FileUpload`: A custom hook-based dropzone with real-time file validation.
  - `MultiDateCalendar`: A Next.js-optimized date picker replacing `flatpickr`.

### Phase 3: Backend & AI Integration
- **Server Actions**: Transition `/upload` and `/generate` endpoints into **Next.js Server Actions** for better security and developer experience.
- **Gemini API**: Securely handle API keys via environment variables or encrypted client inputs, processed on the server side.
- **Processing Stream**: Use **Server-Sent Events (SSE)** or polling via API routes to provide the "Processing Day X of Y" real-time updates.

### Phase 4: Polish & Refinement
- **Animations**: Introduce **Framer Motion** for smooth transitions between wizard steps.
- **Type Safety**: Fully implement **TypeScript** across the codebase for improved reliability.
- **Optimistic UI**: Provide immediate feedback upon file upload and task generation.

---

## 🗺️ Feature Mapping (Vanilla vs. Next.js)

| Feature | Vanilla implementation | Next.js Implementation |
| :--- | :--- | :--- |
| **Logic Root** | Global `script` in `index.html` | App Router (`page.tsx` + Client Components) |
| **State** | Mutable global variables | React State / Context Providers |
| **Form Interaction** | Manual DOM manipulation | `react-hook-form` |
| **Styling** | Ad-hoc CSS variables | Tailwind CSS Utilities |
| **API Calls** | `fetch()` to `/upload`, `/status` | Server Actions / Typed API Routes |
| **Progress** | `setInterval` polling | Optimistic UI + Server Action response |

---

## 🛠️ Modern Technical Stack
- **Framework**: Next.js 15+ (App Router).
- **Logic**: TypeScript.
- **Styling**: Tailwind CSS, Lucide React (Icons), Framer Motion (Animations).
- **UI Library**: Radix UI / Shadcn.
- **Forms**: react-hook-form + Zod.
- **PDF**: `pdf-lib` or a specialized Node.js PDF handler.
- **Gemini**: Google Generative AI SDK for Node.js.
