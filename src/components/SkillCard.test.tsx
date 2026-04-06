import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SkillCard from './SkillCard'
import type { Skill } from '../types'

const mockSkill: Skill = {
  id: 'frontend-design',
  name: 'frontend-design',
  source: 'anthropics/skills',
  install_command: 'claude plugin install example-skills@anthropic-agent-skills',
  description: '创建生产级前端界面，避免通用 AI 美学',
  usage: '构建 UI 时触发',
  tags: ['design', 'frontend'],
}

describe('SkillCard', () => {
  it('renders skill name and description', () => {
    render(<SkillCard skill={mockSkill} pluginId="example-skills" />)
    expect(screen.getByText('frontend-design')).toBeInTheDocument()
    expect(screen.getByText('创建生产级前端界面，避免通用 AI 美学')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<SkillCard skill={mockSkill} pluginId="example-skills" />)
    expect(screen.getByText('design')).toBeInTheDocument()
    expect(screen.getByText('frontend')).toBeInTheDocument()
  })

  it('copies plugin:skill invoke command when pluginId is provided', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
    render(<SkillCard skill={mockSkill} pluginId="example-skills" />)
    fireEvent.click(screen.getByTitle('复制调用命令'))
    expect(writeText).toHaveBeenCalledWith('/example-skills:frontend-design')
  })

  it('copies /skillId when pluginId is not provided (local skill)', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
    render(<SkillCard skill={mockSkill} />)
    fireEvent.click(screen.getByTitle('复制调用命令'))
    expect(writeText).toHaveBeenCalledWith('/frontend-design')
  })
})
