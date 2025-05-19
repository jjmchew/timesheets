export function assertIsDefined<T>(
  val: T,
  varName?: string,
  message?: string,
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      message ??
        `Expected ${varName ? `'${varName}'` : "value"} to be defined, but received ${val}`,
    );
  }
}
