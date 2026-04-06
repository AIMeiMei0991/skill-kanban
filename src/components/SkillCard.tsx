import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Skill } from '../types'

interface Props {
  skill: Skill
  onSelect: (skill: Skill) => void
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
}

export default function SkillCard({ skill, onSelect }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(skill.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <article
      role="article"
      onClick={() => onSelect(skill)}
      className="group relative bg-surface border border-border rounded-lg p-4 cursor-pointer
                 hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-150"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono text-sm font-semibold text-text group-hover:text-accent transition-colors">
          {skill.name}
        </h3>
        <button
          title="复制安装命令"
          onClick={handleCopy}
          className="shrink-0 p-1 rounded text-muted hover:text-text transition-colors"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-muted mb-3 leading-relaxed">{skill.description}</p>

      {/* Tags */}
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
