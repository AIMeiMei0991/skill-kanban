import { X, Copy } from 'lucide-react'
import { useState } from 'react'
import type { Skill } from '../types'

interface Props {
  skill: Skill
  onClose: () => void
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
    >
      <Copy size={12} />
      {copied ? '已复制！' : label}
    </button>
  )
}

export default function SkillDetail({ skill, onClose }: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 sticky top-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-mono text-base font-semibold text-accent">{skill.name}</h2>
          <p className="text-xs text-muted mt-0.5">{skill.source}</p>
        </div>
        <button onClick={onClose} className="text-muted hover:text-text transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-text mb-4">{skill.description}</p>

      {/* Usage */}
      <div className="mb-4">
        <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-1">触发场景</h4>
        <p className="text-xs text-text">{skill.usage}</p>
      </div>

      {/* Install command */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-xs font-mono text-muted uppercase tracking-wider">安装命令</h4>
          <CopyButton text={skill.install_command} label="复制" />
        </div>
        <code className="block text-xs bg-bg text-green-400 font-mono p-2 rounded border border-border break-all">
          {skill.install_command}
        </code>
      </div>

      {/* Dependencies */}
      {skill.dependencies && skill.dependencies.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-1">依赖项</h4>
          <div className="space-y-1">
            {skill.dependencies.map(dep => (
              <code key={dep} className="block text-xs bg-bg text-yellow-400 font-mono p-1.5 rounded border border-border">
                {dep}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Sub-skills */}
      {skill.sub_skills && skill.sub_skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-1">子 Skill</h4>
          <div className="flex flex-wrap gap-1">
            {skill.sub_skills.map(s => (
              <span key={s} className="text-xs bg-bg font-mono text-text px-2 py-0.5 rounded border border-border">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Shortcuts */}
      {skill.shortcuts && skill.shortcuts.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-muted uppercase tracking-wider mb-1">快捷键</h4>
          <div className="space-y-1">
            {skill.shortcuts.map(s => (
              <span key={s} className="block text-xs bg-bg font-mono text-text px-2 py-1 rounded border border-border">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
