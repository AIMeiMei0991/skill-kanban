import { describe, it, expect } from 'vitest'
import { parseInstalledSkills } from './parser'

describe('parseInstalledSkills', () => {
  it('returns empty array for empty input', () => {
    expect(parseInstalledSkills('')).toEqual([])
  })

  it('parses simple plugin list output', () => {
    const input = `
frontend-design@anthropics (1.0.0)
mcp-builder@anthropics (2.1.0)
superpowers@claude-plugins-official (5.0.7)
    `.trim()
    expect(parseInstalledSkills(input)).toEqual([
      'frontend-design',
      'mcp-builder',
      'superpowers',
    ])
  })

  it('handles lines without version', () => {
    const input = 'pdf@anthropics\nxlsx@anthropics'
    expect(parseInstalledSkills(input)).toEqual(['pdf', 'xlsx'])
  })

  it('ignores blank lines and headers', () => {
    const input = `
Installed plugins:

frontend-design@anthropics (1.0.0)

    `.trim()
    expect(parseInstalledSkills(input)).toContain('frontend-design')
  })
})
