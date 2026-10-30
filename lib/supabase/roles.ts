export const SIGNUP_ROLES = [
  { value: "member", label: "Regular member" },
  { value: "core_executive", label: "Core executive member" },
  { value: "executive", label: "Executive member" },
] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number]["value"];

export function isSignupRole(value: string): value is SignupRole {
  return SIGNUP_ROLES.some((role) => role.value === value);
}
