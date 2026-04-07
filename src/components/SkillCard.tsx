import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Skill } from '../types'
import { useToast } from './Toast'

interface Props {
  skill: Skill
  pluginId?: string
  featured?: boolean
  index?: number
}

// 5个语义分组，CSS class 定义在 index.css — 深/亮色双套
const TAG_GROUP: Record<string, string> = {
  // tech — 蓝色系
  development: 'tag-tech', testing: 'tag-tech', api: 'tag-tech',
  git: 'tag-tech', debugging: 'tag-tech', web: 'tag-tech',
  mcp: 'tag-tech', search: 'tag-tech', workflow: 'tag-tech',
  // design — 紫色系
  design: 'tag-design', frontend: 'tag-design', ui: 'tag-design',
  figma: 'tag-design', ux: 'tag-design', creative: 'tag-design',
  theme: 'tag-design', art: 'tag-design',
  // content — 琥珀色系
  docs: 'tag-content', writing: 'tag-content', communication: 'tag-content',
  pdf: 'tag-content', office: 'tag-content', brand: 'tag-content',
  // process — 绿色系
  planning: 'tag-process', agents: 'tag-process', management: 'tag-process',
  strategy: 'tag-process', productivity: 'tag-process',
  // skills — 橙色系（accent）
  skills: 'tag-skills',
}

export default function SkillCard({ skill, pluginId, featured, index = 0 }: Props) {
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  // If skill ID has plugin prefix but name is the short form (e.g. impeccable-animate → animate),
  // use the short name directly without plugin prefix
  const invokeCommand = pluginId && skill.id.startsWith(`${pluginId}-`) && skill.name !== skill.id
    ? `/${skill.name}`
    : pluginId
      ? `/${pluginId}:${skill.id}`
      : `/${skill.id}`

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    await navigator.clipboard.writeText(invokeCommand)
    setCopied(true)
    showToast(`已复制 ${invokeCommand}`)
    setTimeout(() => setCopied(false), 1500)
  }

  // Staggered @starting-style delay — cascading entry effect
  const staggerStyle = {
    transitionDelay: `${Math.min(index * 28, 280)}ms`,
  }

  if (featured) {
    return (
      <article
        className="skill-card lg:col-span-2 bg-surface border border-border rounded-lg p-4 transition-[border-color] duration-150 hover:border-accent/50 group relative overflow-hidden"
        style={staggerStyle}
      >
        {/* Accent sweep line — slides in from left on hover */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-mono text-base font-semibold text-text min-w-0 break-words">
            {skill.name}
          </h3>
          <button
            title="复制调用命令"
            aria-label="复制调用命令"
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded text-muted hover:text-text transition-[color,transform] duration-150 active:scale-75"
          >
            {copied ? <Check size={15} className="text-code" /> : <Copy size={15} />}
          </button>
        </div>
        <p className="text-sm text-muted mb-3 leading-relaxed line-clamp-3">{skill.description}</p>
        <code className="block text-[10px] font-mono text-code bg-bg px-2 py-1 rounded border border-border mb-3 break-all">
          {invokeCommand}
        </code>
        <div className="flex flex-wrap gap-1">
          {skill.tags.map(tag => (
            <span
              key={tag}
              className={`text-[10px] px-1.5 py-0.5 rounded ${TAG_GROUP[tag] ?? 'bg-surface text-muted'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    )
  }

  return (
    <article
      className="skill-card bg-surface border border-border rounded-lg p-4 transition-[border-color] duration-150 hover:border-accent/30 group relative overflow-hidden"
      style={staggerStyle}
    >
      {/* Accent sweep line — slides in from left on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono text-sm font-semibold text-text min-w-0 break-words">
          {skill.name}
        </h3>
        <button
          title="复制调用命令"
          aria-label="复制调用命令"
          onClick={handleCopy}
          className="shrink-0 p-1 rounded text-muted hover:text-text transition-[color,transform] duration-150 active:scale-75"
        >
          {copied ? <Check size={14} className="text-code" /> : <Copy size={14} />}
        </button>
      </div>
      <p className="text-xs text-muted mb-2.5 leading-relaxed line-clamp-3">{skill.description}</p>
      <code className="block text-[10px] font-mono text-code bg-bg px-2 py-1 rounded border border-border mb-3 break-all">
        {invokeCommand}
      </code>
      <div className="flex flex-wrap gap-1">
        {skill.tags.map(tag => (
          <span
            key={tag}
            className={`text-[10px] px-1.5 py-0.5 rounded ${TAG_GROUP[tag] ?? 'bg-surface text-muted'}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
