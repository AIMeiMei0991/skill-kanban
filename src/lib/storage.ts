import type { SkillFlow } from '../types'

const KEY = 'skill_flows'

export function getFlows(): SkillFlow[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveFlow(flow: SkillFlow): void {
  const flows = getFlows()
  const idx = flows.findIndex(f => f.id === flow.id)
  if (idx >= 0) {
    flows[idx] = flow
  } else {
    flows.push(flow)
  }
  localStorage.setItem(KEY, JSON.stringify(flows))
}

export function deleteFlow(id: string): void {
  const flows = getFlows().filter(f => f.id !== id)
  localStorage.setItem(KEY, JSON.stringify(flows))
}
