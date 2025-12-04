# Malmoi Project Context for AI Agents

## 1. Project Overview
**Malmoi (말모이)** is a Korean language tutoring platform connecting students with tutors for 1:1 video lessons.
- **Goal**: Provide a seamless experience for scheduling, booking, and conducting Korean language classes.
- **Current Phase**: Frontend UI complete with Mock Data. Ready for Backend (Supabase) integration.

## 2. Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React / Custom SVGs
- **State Management**: React Hooks (`useState`, `useEffect`) + Server Actions
- **Database (Current)**: In-memory Mock DB (`lib/db.ts`)
- **Database (Planned)**: Supabase

## 3. Project Structure
```
/app
  /login, /signup    # Auth pages
  /class             # Class listing & booking
  /schedule          # User schedule & calendar
  /profile           # User profile & teacher verification
  actions.ts         # Server Actions (currently mock implementations)
  globals.css        # Global styles & Tailwind config
/components
  /ui                # Reusable atoms (Button, Input, Modal, Card, Badge)
  /layout            # Layout components (Navbar, AuthLayout)
/lib
  db.ts              # Mock Database implementation (To be replaced by Supabase client)
  utils.ts           # Utility functions (cn for tailwind-merge)
/types
  index.ts           # Shared TypeScript interfaces (User, ClassItem, ScheduleItem)
/public              # Static assets (SVGs)
```

## 4. Design System
- **Primary Color**: `#00C2FF` (Cyan/Blue) - Used for primary buttons and active states.
- **Background**: White / Light Gray (`#F9FAFB`)
- **Typography**: Clean, modern sans-serif (System fonts).
- **UI Components**:
  - **Buttons**: Rounded corners, distinct primary/outline variants.
  - **Inputs**: Underline style for Auth, Box style for others.
  - **Modals**: Centered, backdrop blur.

## 5. Supabase Migration Guide
The application is structured to easily swap the Mock DB with Supabase.

### Authentication
- **Current**: `app/actions.ts` uses mock `loginAction` / `signupAction`.
- **Target**: Replace with `supabase.auth.signInWithPassword` and `supabase.auth.signUp`.
- **Locations**:
  - `app/login/page.tsx`
  - `app/signup/page.tsx`

### Data Fetching
- **Current**: `lib/db.ts` functions (e.g., `db.class.getAll()`).
- **Target**: Replace calls in Server Components with Supabase queries.
  - Example: `const { data } = await supabase.from('classes').select('*')`

### Data Mutation
- **Current**: `app/actions.ts` updates in-memory arrays.
- **Target**: Use Supabase mutations in Server Actions.
  - Example: `await supabase.from('schedules').insert({...})`

### File Upload (Teacher Verification)
- **Current**: Mock upload in `app/profile/client.tsx`.
- **Target**: Use Supabase Storage.
  - `supabase.storage.from('verifications').upload(...)`

## 6. Key Features Status
| Feature | Status | Note |
| :--- | :--- | :--- |
| **Login/Signup** | UI Ready | Mock Auth logic implemented |
| **Dashboard** | UI Ready | Displays mock schedule & to-dos |
| **Class List** | UI Ready | Filtering & Search functional (Client-side) |
| **Booking** | UI Ready | Mock booking action connected |
| **Schedule** | UI Ready | Date filtering functional |
| **Profile** | UI Ready | Tabbed interface, Mock Verification flow |

## 7. Rules for AI Agents
1.  **Preserve UI**: Do not change the visual design unless explicitly asked. The current design matches the "Toss" aesthetic.
2.  **Server Actions**: Keep logic in `app/actions.ts` to maintain separation of concerns.
3.  **Client vs Server**: Use `use client` only for interactive components (Modals, Forms, Filters). Keep Pages as Server Components for data fetching.
4.  **Supabase**: When asked to implement backend, refer to the Migration Guide above.
