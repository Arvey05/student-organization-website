<!-- BEGIN:nextjs-agent-rules -->

# Next.js version notes

This project uses Next.js 16, which includes breaking API and file-convention changes. Read the relevant guide in `node_modules/next/dist/docs/` before changing framework code, and follow its deprecation notices.

<!-- END:nextjs-agent-rules -->

# Project instructions

Build a student organization website using Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, Supabase Auth, Supabase Storage, GitHub, and Vercel.

Use the Next.js App Router.

Use Tailwind CSS for all styling.

Use Supabase for authentication, database, profile pictures, and role-based access control.

Read these files before making major changes:

* README.md
* WEBSITE_REQUIREMENTS.md
* DESIGN_PROMPT.md

## User Roles

Regular members can:

* View dashboard
* View profile
* Edit their own profile
* View announcements
* View activities
* View calendar
* View registered activities
* Change password
* Logout

President, Vice President for Internal Affairs, and Vice President for External Affairs can:

* Do everything regular members can do
* Add events/programs through an officer-only event form

## Officer-Only Event Form

The event form must include:

* Event / Program Name
* Date and Time
* Short Description
* Location

Only these roles may create events:

* president
* vp_internal_affairs
* vp_external_affairs

## Security Rules

Protect officer-only actions in both:

* Frontend UI
* Supabase Row Level Security policies

Never expose Supabase service role keys in frontend code.

Users should only be able to edit their own profile.

Public users should only access public pages.

Authenticated members should access member pages only after login.

## Development Rules

Before finishing any task, run:

* npm run lint
* npm run build

Keep the code clean, organized, and reusable.

Keep the design modern, clean, responsive, and SaaS-inspired.

Use TypeScript types wherever possible.
