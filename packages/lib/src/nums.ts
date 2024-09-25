export function numberOr(value?: number | undefined | null, or: number = 0) {
  if (isNaN(value ?? 0)) return or
  return Number(value)
}
