import { Copy, Check, Database, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import type { Plugin, PluginType } from '../types'
import { useToast } from './Toast'

interface Props {
  plugin: Plugin
  skillCount: number
}

const TYPE_BADGE: Record<PluginType, { label: string; className: string }> = {
  plugin:  { label: 'plugin',  className: 'badge-plugin' },
  memory:  { label: 'memory',  className: 'badge-memory' },
  local:   { label: 'local',   className: 'badge-local'  },
}

export default function PluginHeader({ plugin, skillCount }: Props) {
  const [copied, setCopied] = useState(false)
  const { showToast } = useToast()

  async function handleCopy() {
    await navigator.clipboard.writeText(plugin.install_command)
    setCopied(true)
    showToast(plugin.install_command)
    setTimeout(() => setCopied(false), 1500)
  }

  const typeBadge = plugin.type ? TYPE_BADGE[plugin.type] : null

  return (
    <div className="border-b border-border pb-6 mb-6">
      {/* 标题行 */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display italic text-3xl sm:text-5xl font-semibold text-accent leading-tight mb-2 break-words">
            {plugin.name}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {typeBadge && (
              <span className={`text-xs px-2 py-0.5 rounded border ${typeBadge.className}`}>
                {plugin.type === 'memory' && <Database size={10} className="inline mr-1 mb-0.5" />}
                {typeBadge.label}
              </span>
            )}
            {plugin.registry && (
              <span className="text-xs font-mono px-2 py-0.5 rounded border border-border text-muted">
                {plugin.registry}
              </span>
            )}
            <span className="text-xs text-muted font-mono">{skillCount} skills</span>
          </div>
        </div>
        {plugin.url && (
          <a
            href={plugin.url}
            target="_blank"
            rel="noopener noreferrer"
            title="在 GitHub 上查看源码"
            className="flex items-center gap-1.5 text-xs text-muted hover:text-text border border-border hover:border-accent/50 px-2.5 py-1 rounded transition-colors duration-150 shrink-0 mt-1"
          >
            <ExternalLink size={12} />
            源地址
          </a>
        )}
      </div>

      {/* 描述 */}
      <p className="text-sm text-muted leading-relaxed mb-4 max-w-prose">{plugin.description}</p>

      {/* Memory worker info */}
      {plugin.type === 'memory' && plugin.has_worker && (
        <div className="flex items-center gap-4 mb-3 px-3 py-2 rounded-lg border border-memory/20 bg-memory/5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted">Worker</span>
            <span className="text-memory">:{plugin.worker_port}</span>
            {plugin.worker_runtime && (
              <span className="text-muted/60">({plugin.worker_runtime})</span>
            )}
          </div>
          {plugin.web_ui && (
            <a href={plugin.web_ui} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-memory hover:text-accent transition-colors">
              <ExternalLink size={11} />
              Web UI
            </a>
          )}
          <span className="text-xs font-mono text-muted/50 ml-auto">npx claude-mem start</span>
        </div>
      )}

      {/* 安装命令 */}
      {plugin.install_command && (
        <div className="flex items-center gap-2 bg-surface rounded border border-border px-3 py-2">
          <code className="flex-1 text-xs font-mono text-code break-all">
            {plugin.install_command}
          </code>
          <button
            title="复制安装命令"
            aria-label="复制安装命令"
            onClick={handleCopy}
            className="shrink-0 p-1 rounded text-muted hover:text-text transition-colors duration-150"
          >
            {copied ? <Check size={14} className="text-code" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  )
}
