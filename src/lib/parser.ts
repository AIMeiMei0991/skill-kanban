export function parseInstalledSkills(raw: string): string[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.includes('@'))
    .map(line => line.split('@')[0].trim())
    .filter(Boolean)
}
