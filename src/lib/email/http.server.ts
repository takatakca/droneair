/**
 * Bounds all Gmail/OAuth HTTP calls. A saved mission must not leave the
 * request waiting indefinitely for an optional email provider.
 */
export const GMAIL_OAUTH_TIMEOUT_MS = 5_000;
export const GMAIL_SEND_TIMEOUT_MS = 8_000;

/**
 * The fetch implementation must honor AbortSignal (global fetch does).
 * Injectable fetcher allows deterministic regression tests without I/O.
 */
export function fetchEmailProvider(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > 30_000) {
    throw new Error("Invalid email provider timeout");
  }
  const signal = AbortSignal.timeout(timeoutMs);
  return fetcher(url, { ...init, signal });
}
