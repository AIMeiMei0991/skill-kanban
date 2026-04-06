import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SkillCard from './SkillCard'
import type { Skill } from '../types'

const mockSkill: Skill = {
  id: 'frontend-design',
  name: 'frontend-design',
  source: 'anthropics/skills',
  install_command: 'claude skill add anthropics/skills/frontend-design',
  description: '创建生产级前端界面，避免通用 AI 美学',
  usage: '构建 UI 时触发',
  tags: ['design', 'frontend'],
}

describe('SkillCard', () => {
  it('renders skill name and description', () => {
    render(<SkillCard skill={mockSkill} onSelect={() => {}} />)
    expect(screen.getByText('frontend-design')).toBeInTheDocument()
    expect(screen.getByText('创建生产级前端界面，避免通用 AI 美学')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<SkillCard skill={mockSkill} onSelect={() => {}} />)
    expect(screen.getByText('design')).toBeInTheDocument()
    expect(screen.getByText('frontend')).toBeInTheDocument()
  })

  it('calls onSelect when card is clicked', () => {
    const onSelect = vi.fn()
    render(<SkillCard skill={mockSkill} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('article'))
    expect(onSelect).toHaveBeenCalledWith(mockSkill)
  })

  it('copies install command when copy button clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
    render(<SkillCard skill={mockSkill} onSelect={() => {}} />)
    fireEvent.click(screen.getByTitle('复制安装命令'))
    expect(writeText).toHaveBeenCalledWith(mockSkill.install_command)
  })
})
