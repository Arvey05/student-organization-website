import type { UserRole } from "@/types/database";

export function formatRole(role: UserRole | null | undefined): string {
  if (role === "core_executive") return "Core executive member";
  if (role === "executive") return "Executive member";
  if (!role) {
    return "Member";
  }

  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDateTimeRange(
  startsAt: string,
  endsAt?: string | null,
): string {
  if (!endsAt) {
    return formatDateTime(startsAt);
  }

  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    const date = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(startDate);
    const startTime = new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
    }).format(startDate);
    const endTime = new Intl.DateTimeFormat("en-US", {
      timeStyle: "short",
    }).format(endDate);

    return `${date}, ${startTime} - ${endTime}`;
  }

  return `${formatDateTime(startsAt)} - ${formatDateTime(endsAt)}`;
}

export function getCalendarDateParts(value: string) {
  const date = new Date(value);

  return {
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
  };
}

export function formatDateTimeLocalInput(value: string): string {
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return offsetDate.toISOString().slice(0, 16);
}
