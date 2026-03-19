import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export class AuthorizationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthorizationError";
  }
}

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "owner";
}

export async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function requireAdmin() {
  const session = await getSessionUser();
  const user = session?.user as { role?: string | null } | undefined;

  if (!session?.user || !isAdminRole(user?.role)) {
    throw new AuthorizationError();
  }

  return session;
}
