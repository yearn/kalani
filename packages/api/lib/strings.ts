export const isNothing = (value?: string | null): boolean => {
  return value === undefined || value === null || value.trim() === ''
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
