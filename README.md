# Student Organization Website

> Current Executive Board access policy (October 25, 2026): the private approved
> roster controls `core_executive` and `executive` roles. Both EB tiers can create
> events after email verification. This supersedes the earlier three-officer
> access descriptions below. See [Executive access setup](EXECUTIVE_ACCESS_SETUP.md)
> for database migrations, private roster import, prepared credentials, and tests.

A website for BulSU MSC members to manage their profiles, read announcements, find activities, and keep track of organization events.

This project is designed to run using a free-tier-friendly stack:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* GitHub
* Vercel

## Project Purpose

This website serves as the official online platform of the student organization. It allows visitors to learn about the organization, view activities and partners, and sign up or log in as members.

Authenticated members can access their dashboard, profile, announcements, calendar, activities, and account settings.

The President, Vice President for Internal Affairs, and Vice President for External Affairs have additional privileges to add events or programs to the website.

## Main Features

### Public Pages

The public side of the website includes:

* Home page
* About page
* Activities page
* Partners page
* Footer with school, OSOA, and government logos
* Social media links
* Login
* Sign up

### Authenticated Member Features

After logging in, users can access:

* Dashboard
* Profile
* Edit profile
* Announcements
* Activities
* Calendar
* My registered activities
* Change password
* Settings
* Logout

### Officer-Only Features

Only the following roles can add events or programs:

* President
* Vice President for Internal Affairs
* Vice President for External Affairs

The event creation form should include:

* Event / Program Name
* Date and Time
* Short Description
* Location

Officer-only features must be protected in both the frontend interface and the Supabase database security rules.

## User Roles

The system should support role-based access control.

Recommended roles:

```ts
member
officer
president
vp_internal_affairs
vp_external_affairs
```

Only these roles may create events:

```ts
president
vp_internal_affairs
vp_external_affairs
```

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage

### Deployment

* GitHub for version control
* Vercel for hosting and deployment

## Recommended Project Structure

```txt
src/
  app/
    page.tsx
    login/
    signup/
    dashboard/
    profile/
    activities/
    announcements/
    calendar/
    settings/

  components/
    ui/
    layout/
    forms/
    dashboard/
    activities/

  lib/
    supabase/
    utils/

  types/
    database.ts

  styles/
    globals.css
```

## Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not commit `.env.local` to GitHub.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local website:

```txt
http://localhost:3000
```

## Build Check

Before deploying or submitting changes, run:

```bash
npm run lint
npm run build
```

The project should pass both commands before deployment.

## Database Tables

Recommended Supabase tables:

* profiles
* announcements
* activities
* activity_registrations
* calendar_events
* partners
* officers
* committees
* event_logs

## Security Requirements

The website must use Supabase Row Level Security.

Security rules should ensure that:

* Users can only edit their own profile.
* Public users can only view public content.
* Members can view authenticated content.
* Only President, VPIA, and VPEA can add events.
* Sensitive keys must never be exposed in frontend code.
* Supabase service role keys must never be used in client-side code.

## Design Direction

The website should use a modern SaaS-inspired design style.

Design characteristics:

* Clean white or light gray background
* Bold hero section
* Rounded navigation and buttons
* Soft gradients
* Floating cards
* Subtle grid or dotted background
* Glassmorphism-style cards
* Smooth hover effects
* Fully responsive layout

The design should feel modern, professional, organized, student-friendly, and easy to use.

## Deployment

The project should be deployed using Vercel.

Recommended deployment flow:

```txt
GitHub Repository → Vercel Project → Automatic Deployment
```

Whenever changes are pushed to the main branch, Vercel should automatically rebuild and redeploy the website.

## Development guidelines

When contributing to this project:

* Follow the requirements in `WEBSITE_REQUIREMENTS.md`.
* Use TypeScript for safer code.
* Use Tailwind CSS for styling.
* Keep components reusable and organized.
* Protect all authenticated routes.
* Protect officer-only features using role-based access control.
* Do not expose secret keys.
* Run `npm run lint` and `npm run build` before finalizing changes.
* Keep the website mobile-responsive.
* Keep the user interface clean, modern, and easy to understand.
