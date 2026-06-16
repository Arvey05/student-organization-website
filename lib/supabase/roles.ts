import type { UserRole } from "@/types/database";

export const OFFICER_EVENT_ROLES = [
  "president",
  "vp_internal_affairs",
  "vp_external_affairs",
] as const satisfies readonly UserRole[];

export type OfficerEventRole = (typeof OFFICER_EVENT_ROLES)[number];

export function canCreateEvents(role: UserRole | null | undefined): boolean {
  return OFFICER_EVENT_ROLES.includes(role as OfficerEventRole);
}
