# Project Instructions for Codex

Build a student organization website using Next.js, React, TypeScript, Tailwind CSS, Supabase, PostgreSQL, Supabase Auth, Supabase Storage, GitHub, and Vercel.

Use the Next.js App Router.

Use Tailwind CSS for all styling.

Use Supabase for authentication, database, profile pictures, and role-based access control.

The website has two user levels:

1. Regular authenticated members
2. President, Vice President for Internal Affairs, and Vice President for External Affairs

Regular members can:
- View dashboard
- View profile
- Edit their own profile
- View announcements
- View activities
- View calendar
- View registered activities
- Change password
- Logout

President, VPIA, and VPEA can:
- Do everything regular members can do
- Add events/programs through an officer-only event form

The event form must include:
- Event / Program Name
- Date and Time
- Short Description
- Location

Only these roles may create events:
- president
- vp_internal_affairs
- vp_external_affairs

Protect officer-only actions in both:
- Frontend UI
- Supabase Row Level Security policies

Never expose Supabase service role keys in frontend code.

Before finishing any task, run:
- npm run lint
- npm run build

Keep the design modern, clean, responsive, and SaaS-inspired.
