/** Server response guards: a successful HTTP result may have affected zero rows. */
export interface QueryError {
  message: string;
}

export function assertQuerySucceeded(
  error: QueryError | null | undefined,
  message: string,
): void {
  if (error) throw new Error(message);
}

export function requireChangedRow<T>(
  row: T | null | undefined,
  error: QueryError | null | undefined,
  message: string,
): T {
  assertQuerySucceeded(error, message);
  if (row == null) throw new Error(message);
  return row;
}

/** A failed/empty exact-count query must never be displayed as zero. */
export function requireExactCount(
  result: { count: number | null; error: QueryError | null },
  message: string,
): number {
  assertQuerySucceeded(result.error, message);
  if (typeof result.count !== "number" || !Number.isSafeInteger(result.count) || result.count < 0) {
    throw new Error(message);
  }
  return result.count;
}
