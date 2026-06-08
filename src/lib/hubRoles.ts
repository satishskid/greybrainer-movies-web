export type HubRole = "admin" | "editor";

const ADMIN_EMAILS = ["satishskid@gmail.com"];

const EDITOR_EMAILS = [
  "skids.social01@gmail.com",
  "saminamishra@gmail.com",
  "saminamisra@gmail.com",
  "mousampatel816@gmail.com",
  "pranitskid@gmail.com",
];

export function normalizeEmail(email: string | null | undefined) {
  return (email || "").trim().toLowerCase();
}

export function getHubRole(email: string | null | undefined): HubRole | null {
  const normalizedEmail = normalizeEmail(email);

  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    return "admin";
  }

  if (EDITOR_EMAILS.includes(normalizedEmail)) {
    return "editor";
  }

  return null;
}

export function canAccessHub(email: string | null | undefined) {
  return getHubRole(email) !== null;
}
