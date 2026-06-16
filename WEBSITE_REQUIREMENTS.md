Functions of the website:
For all website users:
-	Landing Page
o	Home
	Organizational Year Theme
	Who we are
	Mission, Vision
	Members Benefits
	Our Partners
o	About
	Who we are
	Mission, Vision
	What we Do
	Members Benefits
	The organization officers
	Organization Committee
	OFFICIAL YEAR-LONG PHOTOGRAPHY PARTNER | Logo
o	Activities
	Upcoming
	Completed
	Past Activities
o	Partners
o	Footer includes:
	3 Logo’s of School Logo, OSOA Logo, and Government Logo.
	Social Media Logo Hyperlink of the student organization.
Then user have options to:
-	Log-in
-	Sign-up
After Sign-up/Log-in:
-	Landing Page:
o	Home
o	About
o	Activities
	Upcoming
	Completed
	Past Activities
o	Announcements
o	Calendar
o	Profile
	Profile Edit
•	Profile Picture
o	MSC ID Code
o	Full Name
o	SCHOOL ID Code
o	Program
o	College
o	Year Level
o	Active | Officer or Member 
•	Personal Information
o	Section
o	Username
o	Date of Birth
o	Address
o	Social Media
o	Member Since
o	Email
o	Gender
o	Phone
	Dashboard
•	Greetings
•	Important Updates
o	Membership Status (Active or Not)
o	Events Joined
o	Pre-Registered
•	Member Profile
o	Full Name
o	SCHOOL ID Code
o	Program
o	Active | Officer or Member
o	College
o	Year Level
o	MSC ID Code
o	Last Login
o	Edit Profile
o	Change Password
o	Logout
•	Announcements
•	Activities
•	University Calendar
•	My Registered Activities
•	Calendar
	Edit Profile
o	For here it is just a form that contains the following information that can be modified and saved or reset or discard: MSC ID Code, SCHOOL ID Code, Last Name, First Name, Middle Name, Extension, College, Program and Major, Year, Section, Contact Information (Contact Number, Personal Email, BulSU Email, Facebook Profile Link). Personal Information (Profile Picture, Change Profile Picture Button, Current Adress, Birthdate, Age, Gender). Guardian Information (Name of Guardian, Relationship to Guardian, Contact Number of the Guardian, Address of the Guardian)
o	A button for changing password, which contains:
	Old Password
	New Password
	Confirm Password
	Change Password Button
	Settings
•	Profile
o	Settings
	Edit Personal Information Button 
	Change Profile Picture Button
•	Password
o	Change Password Button Directing to the already defined change password form.
•	Delete Account
o	Contact Form Directing to the ORGANIZATION Email about deleting the account concerns.
•	Logout
	Logout
For President, VPIA & VPEA only:
-	All the functionalities above but with added functions
-	The adding of event button that directs to the event form contains:
o	Event / Program Name
o	Date and Time
o	Short Description
o	Location
Final Recommended Tech Stack and Build Description
The website should be built using a modern, free-tier-friendly tech stack suitable for deployment on Vercel Hobby Plan and Supabase Free Tier.
The recommended stack is:
Next.js + React + TypeScript + Tailwind CSS + Supabase + PostgreSQL + Supabase Auth + Supabase Storage + GitHub + Vercel
Use Next.js as the main web framework because it is built for React applications and works very well with Vercel deployment. Use React to build reusable user interface components such as navigation bars, cards, dashboards, forms, profile pages, and activity sections. Use TypeScript to make the code safer, cleaner, and easier to maintain by reducing common JavaScript errors. Use Tailwind CSS for fast, modern, responsive, and consistent styling.
Use Supabase as the backend service. Supabase should handle the database, authentication, file storage, and security rules. Use PostgreSQL as the main database because Supabase projects use PostgreSQL. Use Supabase Auth for user sign-up, login, logout, password change, and protected pages. Use Supabase Storage for profile pictures, organization logos, partner logos, and activity images. Use Row Level Security to make sure users can only access or edit data allowed for their role.
Use Vercel for hosting and deployment. The project should be connected to GitHub, so every code update can be pushed to GitHub and deployed through Vercel.
The website should support two main access levels:
1.	Regular authenticated users / members 
o	Can access the landing page, announcements, activities, calendar, dashboard, profile, edit profile, change password, settings, and logout. 
o	Can view upcoming, completed, and past activities. 
o	Can view their own registered activities. 
o	Can edit only their own profile information. 
o	Can upload or update their own profile picture. 
2.	President, Vice President for Internal Affairs, and Vice President for External Affairs 
o	Can access all regular user/member features. 
o	Have an additional role-based privilege to add events or programs to the website. 
o	The event form should contain: 
	Event / Program Name 
	Date and Time 
	Short Description 
	Location 
o	Only these three officer roles should be allowed to access the event creation button and event creation form. 
The system should use role-based access control. Each user account should have a role field in the database, such as:
•	member 
•	officer 
•	president 
•	vp_internal_affairs 
•	vp_external_affairs 
Only users with the roles president, vp_internal_affairs, or vp_external_affairs should be allowed to add events.
Recommended database tables:
•	profiles — stores member and officer profile information. 
•	announcements — stores organization announcements. 
•	activities — stores upcoming, completed, and past activities. 
•	activity_registrations — stores which members joined or pre-registered for activities. 
•	calendar_events — stores calendar-related events. 
•	partners — stores organization partner details and logos. 
•	officers — stores organization officer information. 
•	committees — stores organization committee information. 
•	event_logs — optional table for tracking who added events. 
Recommended libraries:
•	@supabase/supabase-js for connecting the frontend to Supabase. 
•	@supabase/ssr for secure Supabase authentication with Next.js. 
•	react-hook-form for handling forms. 
•	zod for form validation. 
•	lucide-react for modern icons. 
•	fullcalendar or react-big-calendar for the calendar feature. 
•	date-fns for formatting dates and times. 
The website should be mobile-responsive, clean, modern, and easy to use. Public pages should be accessible to everyone, while dashboard, profile, announcements, calendar, and activity registration features should require login. Officer-only event creation must be protected both in the user interface and in the Supabase database security rules.
