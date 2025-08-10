export function normalizeData(input: any) {
  return input.replace(/^\d+\s+/gm, "").replace(/\n\s*\n+/g, "\n");
}
