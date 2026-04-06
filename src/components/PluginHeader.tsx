import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Plugin } from '../types'

interface Props {
  plugin: Plugin
  skillCount: number
}

export default function PluginHeader({ plugin, skillCount }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(plugin.install_command)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-5 mb-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-mono text-lg font-semibold text-accent">{plugin.name}</h2>
          {plugin.registry && (
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-border text-muted">
              {plugin.registry}
            </span>
          )}
          <span className="text-xs font-mono text-muted">
            {skillCount} skills
          </span>
        </div>
      </div>
      <p className="text-sm text-text mb-4 leading-relaxed">{plugin.description}</p>
      {plugin.install_command && (
        <div>
          <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1.5">安装命令</p>
          <div className="flex items-center gap-2 bg-bg rounded border border-border px-3 py-2">
            <code className="flex-1 text-xs font-mono text-green-400 break-all">
              {plugin.install_command}
            </code>
            <button
              title="复制安装命令"
              onClick={handleCopy}
              className="shrink-0 p-1 rounded text-muted hover:text-text transition-colors"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
