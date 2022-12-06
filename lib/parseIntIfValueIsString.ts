export function parseIntIfValueIsString(value: string | number) {
  return typeof value === 'string' ? parseInt(value) : value;
}
