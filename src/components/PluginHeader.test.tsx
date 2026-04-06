import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PluginHeader from './PluginHeader'
import type { Plugin } from '../types'

const mockPlugin: Plugin = {
  id: 'superpowers',
  name: 'superpowers',
  registry: 'claude-plugins-official',
  description: '开发工作流技能包',
  install_command: 'claude plugin install superpowers@claude-plugins-official',
  skill_ids: ['brainstorming'],
}

const localPlugin: Plugin = {
  id: 'local',
  name: '本地安装',
  registry: '',
  description: '本地 skill',
  install_command: '',
  skill_ids: ['ux-audit'],
}

describe('PluginHeader', () => {
  it('renders plugin name and description', () => {
    render(<PluginHeader plugin={mockPlugin} skillCount={14} />)
    expect(screen.getByText('superpowers')).toBeInTheDocument()
    expect(screen.getByText('开发工作流技能包')).toBeInTheDocument()
  })

  it('renders registry badge when registry is non-empty', () => {
    render(<PluginHeader plugin={mockPlugin} skillCount={14} />)
    expect(screen.getByText('claude-plugins-official')).toBeInTheDocument()
  })

  it('renders skill count', () => {
    render(<PluginHeader plugin={mockPlugin} skillCount={14} />)
    expect(screen.getByText(/14/)).toBeInTheDocument()
  })

  it('renders install command', () => {
    render(<PluginHeader plugin={mockPlugin} skillCount={14} />)
    expect(screen.getByText('claude plugin install superpowers@claude-plugins-official')).toBeInTheDocument()
  })

  it('copies install command when copy button clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
    render(<PluginHeader plugin={mockPlugin} skillCount={14} />)
    fireEvent.click(screen.getByTitle('复制安装命令'))
    expect(writeText).toHaveBeenCalledWith('claude plugin install superpowers@claude-plugins-official')
  })

  it('hides copy button when install_command is empty', () => {
    render(<PluginHeader plugin={localPlugin} skillCount={1} />)
    expect(screen.queryByTitle('复制安装命令')).not.toBeInTheDocument()
  })
})
