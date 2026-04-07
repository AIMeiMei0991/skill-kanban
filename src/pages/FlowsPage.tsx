import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Check, Database, Pencil, X, Zap } from 'lucide-react'
import pluginsData from '../data/plugins.json'
import type { Plugin, SkillFlow } from '../types'
import { getFlows, saveFlow, deleteFlow } from '../lib/storage'

const plugins = (pluginsData as Plugin[]).filter(p => p.install_command)

function generateCommand(flow: SkillFlow): string {
  const cmds = flow.plugin_ids
    .map(id => plugins.find(p => p.id === id)?.install_command)
    .filter(Boolean) as string[]
  return [...new Set(cmds)].join(' && \\\n')
}

// 插件多选列表（创建和编辑共用）
function PluginSelector({
  selectedIds,
  onToggle,
}: {
  selectedIds: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {plugins.map(plugin => {
        const selected = selectedIds.has(plugin.id)
        return (
          <label
            key={plugin.id}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selected
                ? 'border-accent bg-accent/10 text-text'
                : 'border-border bg-bg text-muted hover:border-accent/40'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={selected}
              onChange={() => onToggle(plugin.id)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                {plugin.type === 'memory' && (
                  <Database size={10} className="text-memory shrink-0" />
                )}
                <span className="text-xs font-mono font-semibold truncate">
                  {plugin.name}
                </span>
                <span className="text-[10px] font-mono text-muted/60 shrink-0">
                  {plugin.skill_ids.length} skills
                </span>
              </div>
              <p className="text-[10px] text-muted leading-relaxed line-clamp-2">
                {plugin.description}
              </p>
            </div>
            <div className={`w-3.5 h-3.5 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              selected ? 'bg-accent border-accent' : 'border-border'
            }`}>
              {selected && <Check size={9} className="text-white" />}
            </div>
          </label>
        )
      })}
    </div>
  )
}

export default function FlowsPage() {
  const [flows, setFlows] = useState<SkillFlow[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPluginIds, setNewPluginIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editPluginIds, setEditPluginIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setFlows(getFlows())
  }, [])

  function handleCreate() {
    if (!newName.trim() || newPluginIds.size === 0) return
    const flow: SkillFlow = {
      id: `flow-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || undefined,
      plugin_ids: [...newPluginIds],
      created_at: new Date().toISOString(),
    }
    saveFlow(flow)
    setFlows(getFlows())
    setCreating(false)
    setNewName('')
    setNewDesc('')
    setNewPluginIds(new Set())
  }

  function handleCancel() {
    setCreating(false)
    setNewName('')
    setNewDesc('')
    setNewPluginIds(new Set())
  }

  function handleDelete(id: string) {
    deleteFlow(id)
    setFlows(getFlows())
    setConfirmingDeleteId(null)
  }

  async function handleCopy(flow: SkillFlow) {
    await navigator.clipboard.writeText(generateCommand(flow))
    setCopiedId(flow.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  function toggleNewPlugin(id: string) {
    setNewPluginIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleEditPlugin(id: string) {
    setEditPluginIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function startEdit(flow: SkillFlow) {
    setEditingId(flow.id)
    setEditName(flow.name)
    setEditDesc(flow.description ?? '')
    setEditPluginIds(new Set(flow.plugin_ids))
    setConfirmingDeleteId(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditDesc('')
    setEditPluginIds(new Set())
  }

  function handleSaveEdit(flow: SkillFlow) {
    if (!editName.trim() || editPluginIds.size === 0) return
    saveFlow({
      ...flow,
      name: editName.trim(),
      description: editDesc.trim() || undefined,
      plugin_ids: [...editPluginIds],
    })
    setFlows(getFlows())
    cancelEdit()
  }

  const totalSkills = (flow: SkillFlow) =>
    flow.plugin_ids.reduce((sum, id) => {
      const p = plugins.find(p => p.id === id)
      return sum + (p?.skill_ids.length ?? 0)
    }, 0)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display italic text-2xl text-muted/70">
          {flows.length} 个 Skill 流
        </h2>
        <button
          onClick={() => setCreating(true)}
          disabled={creating}
          className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover disabled:opacity-40
                     text-white px-3 py-2.5 rounded transition-colors"
        >
          <Plus size={14} />
          新建流
        </button>
      </div>

      {/* 创建表单 */}
      {creating && (
        <div className="bg-surface border border-accent/50 rounded-lg p-5 mb-6">
          <h3 className="text-sm font-semibold text-text mb-4">新建 Skill 流</h3>

          <input
            type="text"
            placeholder="流的名称，例如：新项目标配"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
            className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text
                       placeholder-muted outline-none focus:border-accent mb-3"
          />

          <textarea
            placeholder="描述这个流的用途（可选）"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            rows={2}
            className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text
                       placeholder-muted outline-none focus:border-accent mb-4 resize-none"
          />

          <p className="text-xs text-muted mb-2.5">选择要包含的插件包：</p>
          <div className="mb-4">
            <PluginSelector selectedIds={newPluginIds} onToggle={toggleNewPlugin} />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || newPluginIds.size === 0}
              className="text-sm bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed
                         text-white px-4 py-2.5 rounded transition-colors"
            >
              创建
            </button>
            <button
              onClick={handleCancel}
              className="text-sm text-muted hover:text-text px-4 py-2.5 rounded border border-border transition-colors"
            >
              取消
            </button>
            {(!newName.trim() || newPluginIds.size === 0) && (
              <p className="text-xs text-muted/60 w-full mt-0.5">
                {!newName.trim() ? '请先输入流的名称' : '请至少选择 1 个插件包'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 流列表 */}
      <div className="space-y-3">
        {/* 空状态引导 */}
        {flows.length === 0 && !creating && (
          <div className="py-12 px-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
              <Zap size={22} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-text mb-2">什么是 Skill 流？</h3>
            <p className="text-sm text-muted leading-relaxed mb-1 max-w-xs mx-auto">
              把多个插件包打包成一条安装命令。开新项目时一键安装你常用的 skill 组合。
            </p>
            <p className="text-xs text-muted/60 mb-6 max-w-xs mx-auto">
              例如：把「superpowers」「pua」「figma」合成一条 <code className="font-mono">claude install</code> 命令
            </p>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover
                         text-white px-4 py-2.5 rounded transition-colors"
            >
              <Plus size={14} />
              创建第一个流
            </button>
          </div>
        )}

        {flows.map(flow => (
          <div
            key={flow.id}
            className={`bg-surface border rounded-lg transition-colors ${
              editingId === flow.id ? 'border-accent/60' : 'border-border'
            }`}
          >
            {editingId === flow.id ? (
              /* ── 编辑模式 ── */
              <div className="p-4">
                <h3 className="text-xs text-muted uppercase tracking-wider mb-3">编辑流</h3>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  autoFocus
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text
                             outline-none focus:border-accent mb-3"
                />
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={2}
                  placeholder="描述（可选）"
                  className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text
                             placeholder-muted outline-none focus:border-accent mb-4 resize-none"
                />
                <p className="text-xs text-muted mb-2.5">插件包：</p>
                <div className="mb-4">
                  <PluginSelector selectedIds={editPluginIds} onToggle={toggleEditPlugin} />
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <button
                    onClick={() => handleSaveEdit(flow)}
                    disabled={!editName.trim() || editPluginIds.size === 0}
                    className="text-sm bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed
                               text-white px-4 py-2 rounded transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-sm text-muted hover:text-text px-4 py-2 rounded border border-border transition-colors"
                  >
                    取消
                  </button>
                  {(!editName.trim() || editPluginIds.size === 0) && (
                    <p className="text-xs text-muted/60 w-full mt-0.5">
                      {!editName.trim() ? '请先输入流的名称' : '请至少选择 1 个插件包'}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* ── 展示模式 ── */
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-display italic text-lg text-accent">{flow.name}</h3>
                    {flow.description && (
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">{flow.description}</p>
                    )}
                    <p className="text-[10px] text-muted/60 mt-1">
                      {flow.plugin_ids.length} 个插件 · {totalSkills(flow)} 个 skill
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    {/* 复制命令 */}
                    <button
                      onClick={() => handleCopy(flow)}
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors px-2 py-1.5"
                    >
                      {copiedId === flow.id
                        ? <><Check size={12} className="text-code" /> 已复制</>
                        : <><Copy size={12} /> 复制</>
                      }
                    </button>

                    {/* 编辑 */}
                    <button
                      onClick={() => startEdit(flow)}
                      title="编辑流"
                      aria-label="编辑流"
                      className="p-1.5 text-muted hover:text-text transition-colors rounded"
                    >
                      <Pencil size={13} />
                    </button>

                    {/* 删除 — inline 确认 */}
                    {confirmingDeleteId === flow.id ? (
                      <span className="flex items-center gap-1 ml-1">
                        <button
                          onClick={() => handleDelete(flow.id)}
                          className="text-xs text-danger border border-danger/50 bg-danger/5 hover:bg-danger/15
                                     px-2 py-1 rounded transition-colors"
                        >
                          确认删除
                        </button>
                        <button
                          onClick={() => setConfirmingDeleteId(null)}
                          className="p-1 text-muted hover:text-text transition-colors rounded"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmingDeleteId(flow.id)}
                        title="删除流"
                        aria-label="删除流"
                        className="p-1.5 text-muted hover:text-danger transition-colors rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 插件 chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {flow.plugin_ids.map(id => {
                    const p = plugins.find(p => p.id === id)
                    return (
                      <span key={id} className="text-[10px] font-mono bg-bg text-muted px-2 py-0.5 rounded border border-border flex items-center gap-1">
                        {p?.type === 'memory' && <Database size={8} className="text-memory" />}
                        {p?.name ?? id}
                      </span>
                    )
                  })}
                </div>

                {/* 生成命令 */}
                <pre className="text-[10px] font-mono text-code bg-bg p-2 rounded border border-border overflow-x-auto">
                  {generateCommand(flow)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
