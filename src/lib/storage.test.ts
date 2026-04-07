/// <reference types="vitest" />
import { describe, it, expect, beforeEach } from 'vitest'
import { getFlows, saveFlow, deleteFlow } from './storage'
import type { SkillFlow } from '../types'

const mockFlow: SkillFlow = {
  id: 'flow-1',
  name: '新项目标配',
  plugin_ids: ['frontend-design', 'mcp-builder'],
  created_at: '2026-04-06T00:00:00Z',
}

beforeEach(() => {
  localStorage.clear()
})

describe('getFlows', () => {
  it('returns empty array when no flows saved', () => {
    expect(getFlows()).toEqual([])
  })

  it('returns saved flows', () => {
    localStorage.setItem('skill_flows', JSON.stringify([mockFlow]))
    expect(getFlows()).toEqual([mockFlow])
  })
})

describe('saveFlow', () => {
  it('adds a new flow', () => {
    saveFlow(mockFlow)
    expect(getFlows()).toHaveLength(1)
    expect(getFlows()[0]).toEqual(mockFlow)
  })

  it('updates existing flow with same id', () => {
    saveFlow(mockFlow)
    const updated = { ...mockFlow, name: '已更新' }
    saveFlow(updated)
    expect(getFlows()).toHaveLength(1)
    expect(getFlows()[0].name).toBe('已更新')
  })
})

describe('deleteFlow', () => {
  it('removes flow by id', () => {
    saveFlow(mockFlow)
    deleteFlow('flow-1')
    expect(getFlows()).toEqual([])
  })

  it('does nothing if id not found', () => {
    saveFlow(mockFlow)
    deleteFlow('nonexistent')
    expect(getFlows()).toHaveLength(1)
  })
})
