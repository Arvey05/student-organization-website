import type { UserRole } from "@/types/database";

export const memberAnnouncements = [
  {
    title: "Membership profile completion",
    date: "June 20, 2026",
    summary:
      "Members are encouraged to complete their profile information before joining upcoming activities.",
  },
  {
    title: "Leadership Forum registration",
    date: "June 24, 2026",
    summary:
      "Pre-registration is open for the next student leadership forum. Slots will be tracked from member accounts.",
  },
  {
    title: "Committee volunteer call",
    date: "June 30, 2026",
    summary:
      "Members may soon volunteer for committees through the organization platform.",
  },
];

export const memberActivities = [
  {
    name: "Leadership Forum",
    date: "June 28, 2026",
    location: "University Function Hall",
    status: "Pre-registered",
  },
  {
    name: "Membership Orientation",
    date: "July 5, 2026",
    location: "Student Center",
    status: "Open",
  },
  {
    name: "Community Service Drive",
    date: "May 18, 2026",
    location: "Partner community",
    status: "Joined",
  },
];

export const calendarPreview = [
  { day: "20", month: "Jun", title: "Membership registration opens" },
  { day: "28", month: "Jun", title: "Leadership Forum" },
  { day: "05", month: "Jul", title: "Membership Orientation" },
  { day: "12", month: "Jul", title: "Partner planning session" },
];

export function formatRole(role: UserRole | null | undefined): string {
  if (!role) {
    return "Member";
  }

  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
