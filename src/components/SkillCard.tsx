import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Skill } from '../types'

interface Props {
  skill: Skill
  pluginId?: string
}

const TAG_COLORS: Record<string, string> = {
  design: 'bg-purple-900/40 text-purple-300',
  frontend: 'bg-blue-900/40 text-blue-300',
  api: 'bg-green-900/40 text-green-300',
  docs: 'bg-yellow-900/40 text-yellow-300',
  testing: 'bg-red-900/40 text-red-300',
  development: 'bg-cyan-900/40 text-cyan-300',
  writing: 'bg-orange-900/40 text-orange-300',
  art: 'bg-pink-900/40 text-pink-300',
  office: 'bg-indigo-900/40 text-indigo-300',
  mcp: 'bg-teal-900/40 text-teal-300',
  brand: 'bg-rose-900/40 text-rose-300',
  creative: 'bg-fuchsia-900/40 text-fuchsia-300',
  pdf: 'bg-yellow-900/40 text-yellow-300',
  theme: 'bg-violet-900/40 text-violet-300',
  skills: 'bg-sky-900/40 text-sky-300',
  communication: 'bg-lime-900/40 text-lime-300',
  ui: 'bg-blue-900/40 text-blue-300',
  workflow: 'bg-amber-900/40 text-amber-300',
  planning: 'bg-emerald-900/40 text-emerald-300',
  agents: 'bg-violet-900/40 text-violet-300',
  git: 'bg-orange-900/40 text-orange-300',
  debugging: 'bg-red-900/40 text-red-300',
  productivity: 'bg-pink-900/40 text-pink-300',
  figma: 'bg-purple-900/40 text-purple-300',
  web: 'bg-cyan-900/40 text-cyan-300',
  search: 'bg-teal-900/40 text-teal-300',
  ux: 'bg-indigo-900/40 text-indigo-300',
  management: 'bg-rose-900/40 text-rose-300',
  strategy: 'bg-amber-900/40 text-amber-300',
}

export default function SkillCard({ skill, pluginId }: Props) {
  const [copied, setCopied] = useState(false)

  const invokeCommand = pluginId
    ? `/${pluginId}:${skill.id}`
    : `/${skill.id}`

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(invokeCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <article
      role="article"
      className="bg-surface border border-border rounded-lg p-4 transition-all duration-150 hover:border-accent/50"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono text-sm font-semibold text-text">
          {skill.name}
        </h3>
        <button
          title="复制调用命令"
          onClick={handleCopy}
          className="shrink-0 p-1 rounded text-muted hover:text-text transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <p className="text-xs text-muted mb-3 leading-relaxed">{skill.description}</p>
      <div className="flex flex-wrap gap-1">
        {skill.tags.map(tag => (
          <span
            key={tag}
            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${TAG_COLORS[tag] ?? 'bg-surface text-muted'}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
