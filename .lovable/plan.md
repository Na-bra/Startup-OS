

# Login & Signup with Supabase Auth + Role Selection

## What You'll Get
- **Login page** — email/password with a role selector (Student, Mentor, Admin)
- **Signup page** — name, email, password, role selector
- Protected routes — unauthenticated users redirected to `/login`
- After login, redirected to the correct role-based dashboard

## Database Changes (1 migration)

1. **Create `profiles` table** linked to `auth.users` — stores `full_name`, `avatar_url`
2. **Create `user_roles` table** — `user_id` (references `auth.users`), `role` enum (student/mentor/admin)
3. **`has_role()` security definer function** for RLS
4. **Trigger** to auto-create profile row on signup
5. **RLS policies** on both tables (users can read their own data)

## New Files

| File | What it does |
|------|-------------|
| `src/pages/auth/Login.tsx` | Email, password, role radio group, sign-in button, link to signup |
| `src/pages/auth/Signup.tsx` | Name, email, password, role radio group, create account button |
| `src/components/layout/AuthLayout.tsx` | Centered card with Startup OS branding, no sidebar |

## Changes to Existing Files

- **`src/contexts/AuthContext.tsx`** — Replace mock auth with real Supabase Auth. Use `onAuthStateChange` + `getSession`. Fetch role from `user_roles` table. Add `signup()` method.
- **`src/App.tsx`** — Add `/login` and `/signup` as public routes. Redirect unauthenticated users to `/login`.
- **`src/data/mock-data.ts`** — Keep for fallback but no longer used as primary data source.

## Design
- Rocket icon + "Startup OS" heading at top of card
- Radio group for role selection (Student / Mentor / Admin)
- Blue primary button, white card on light gray background
- Toast notifications for errors (wrong password, etc.)

## Flow
1. User visits `/signup` → fills form with role → Supabase creates auth user → trigger creates profile → app inserts role into `user_roles` → redirected to `/dashboard`
2. User visits `/login` → enters email/password → Supabase authenticates → app fetches role from `user_roles` → redirected to role-appropriate dashboard
3. Logout clears session → redirect to `/login`

