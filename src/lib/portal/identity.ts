/** Trusted identity checks for admin-led client invitations.
 * Never grant access from a mutable profile email alone.
 */
export interface AuthEmailIdentity {
  email?: string | null;
  email_confirmed_at?: string | null;
  is_anonymous?: boolean;
}

export function matchesVerifiedEmailIdentity(
  user: AuthEmailIdentity | null | undefined,
  expectedEmail: string,
): boolean {
  if (!user || user.is_anonymous === true || !user.email_confirmed_at) return false;
  const actualEmail = user.email?.trim().toLowerCase();
  const normalizedExpected = expectedEmail.trim().toLowerCase();
  return Boolean(actualEmail && normalizedExpected && actualEmail === normalizedExpected);
}
