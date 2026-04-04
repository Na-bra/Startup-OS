

# Startup OS — MVP Build Plan

## Overview
A centralized web platform for managing startups in a school collaborative lab. Three role-based dashboards (Student, Mentor, Admin) plus a public showcase page, powered by Supabase Auth and database.

## Phase 1: Foundation

### 1. Supabase Setup — Database Schema
Create the following tables via migrations:

- **profiles** — linked to `auth.users`, stores display name, avatar, bio
- **user_roles** — stores role assignments (student, mentor, admin) per user
- **startups** — name, description, stage (idea → growth), logo, created_by
- **startup_members** — links users to startups (role: founder, member)
- **milestones** — per-startup milestones with status (pending, in-progress, completed)
- **tasks** — per-milestone tasks with assignee, due date, status
- **documents** — file metadata (name, URL, type) linked to startups, stored in Supabase Storage
- **mentorship_records** — mentor-startup assignments with session logs and feedback
- **activity_logs** — tracks key actions across the platform

### 2. Auth & Role-Based Access
- Supabase Auth with email/password signup and login
- Auto-create profile on signup via database trigger
- Role selection during onboarding (student/mentor/admin)
- Row-Level Security policies on all tables using a `has_role()` security definer function
- Protected routes that redirect based on user role

### 3. App Shell & Navigation
- Sidebar layout using shadcn Sidebar component
- Role-aware navigation: different menu items per role
- Clean professional design: blue primary (#2563EB), gray backgrounds, structured layouts
- Responsive — works on the 673px viewport and larger

## Phase 2: Student Dashboard

- **My Startup** profile page — edit name, description, stage, team members
- **Milestones** tracker — visual progress through growth stages with task checklists
- **Documents** section — upload/view pitch decks, reports, files (Supabase Storage)
- **Activity feed** — recent actions on their startup

## Phase 3: Mentor Dashboard

- **Assigned Startups** list — cards showing each startup's stage and progress
- **Startup Detail** view — see milestones, documents, team for a specific startup
- **Feedback** system — add session notes and structured feedback per startup
- **Progress Overview** — at-a-glance view of all assigned startups' health

## Phase 4: Admin Panel

- **Overview Dashboard** — key metrics (total startups, active mentorships, milestones completed)
- **All Startups** table — filterable/sortable list with stage, progress, mentor assignment
- **User Management** — view all users, assign roles, assign mentors to startups
- **Engagement Tracking** — identify stagnating startups vs progressing ones

## Phase 5: Public Showcase

- **Public page** (no auth required) — grid/cards of startups with name, description, stage
- **Startup detail** — public profile with team, milestones achieved, pitch deck if shared

## Technical Details

- **Stack**: React 18 + TypeScript + Tailwind CSS + shadcn/ui + Supabase
- **Auth**: Supabase Auth, profiles table with trigger, user_roles table with `has_role()` function
- **Storage**: Supabase Storage bucket for documents
- **RLS**: All tables protected with role-based policies
- **Routing**: React Router with role-based route guards

## Build Order
We'll build sequentially: Foundation (schema + auth + shell) → Student Dashboard → Mentor Dashboard → Admin Panel → Public Showcase. Each phase will be functional before moving to the next.

