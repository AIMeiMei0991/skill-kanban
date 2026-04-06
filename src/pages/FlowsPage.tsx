import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Check } from 'lucide-react'
import skillsData from '../data/skills.json'
import type { Skill, SkillFlow } from '../types'
import { getFlows, saveFlow, deleteFlow } from '../lib/storage'

const skills = skillsData as Skill[]

function generateCommand(flow: SkillFlow): string {
  return flow.skill_ids
    .map(id => {
      const skill = skills.find(s => s.id === id)
      return skill ? skill.install_command : null
    })
    .filter(Boolean)
    .join(' && \\\n')
}

export default function FlowsPage() {
  const [flows, setFlows] = useState<SkillFlow[]>([])
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSkillIds, setNewSkillIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    setFlows(getFlows())
  }, [])

  function handleCreate() {
    if (!newName.trim() || newSkillIds.size === 0) return
    const flow: SkillFlow = {
      id: `flow-${Date.now()}`,
      name: newName.trim(),
      skill_ids: [...newSkillIds],
      created_at: new Date().toISOString(),
    }
    saveFlow(flow)
    setFlows(getFlows())
    setCreating(false)
    setNewName('')
    setNewSkillIds(new Set())
  }

  function handleDelete(id: string) {
    deleteFlow(id)
    setFlows(getFlows())
  }

  async function handleCopy(flow: SkillFlow) {
    await navigator.clipboard.writeText(generateCommand(flow))
    setCopiedId(flow.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  function toggleSkill(id: string) {
    setNewSkillIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-sm text-muted">
          {flows.length} 个 Skill 流
        </h2>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-white
                     px-3 py-1.5 rounded transition-colors font-mono"
        >
          <Plus size={14} />
          新建流
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="bg-surface border border-accent/50 rounded-lg p-4 mb-6">
          <h3 className="font-mono text-sm font-semibold text-text mb-3">新建 Skill 流</h3>
          <input
            type="text"
            placeholder="流的名称，例如：新项目标配"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full bg-bg border border-border rounded px-3 py-2 text-sm text-text
                       placeholder-muted outline-none focus:border-accent mb-4 font-mono"
          />
          <p className="text-xs text-muted mb-2">选择要包含的 Skill：</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-4 max-h-48 overflow-y-auto">
            {skills.map(skill => (
              <label
                key={skill.id}
                className={`flex items-center gap-2 text-xs font-mono p-2 rounded border cursor-pointer transition-colors ${
                  newSkillIds.has(skill.id)
                    ? 'border-accent bg-accent/10 text-text'
                    : 'border-border bg-bg text-muted hover:border-accent/50'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={newSkillIds.has(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                />
                {skill.name}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || newSkillIds.size === 0}
              className="text-sm bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed
                         text-white px-4 py-1.5 rounded transition-colors font-mono"
            >
              创建
            </button>
            <button
              onClick={() => { setCreating(false); setNewName(''); setNewSkillIds(new Set()) }}
              className="text-sm text-muted hover:text-text px-4 py-1.5 rounded border border-border transition-colors font-mono"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Flow list */}
      <div className="space-y-3">
        {flows.length === 0 && !creating && (
          <p className="text-muted text-sm font-mono py-8 text-center">
            还没有 Skill 流，点击「新建流」开始
          </p>
        )}
        {flows.map(flow => (
          <div key={flow.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-mono text-sm font-semibold text-text">{flow.name}</h3>
                <p className="text-xs text-muted mt-0.5">{flow.skill_ids.length} 个 skill</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(flow)}
                  className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors font-mono"
                >
                  {copiedId === flow.id
                    ? <><Check size={12} className="text-green-400" /> 已复制</>
                    : <><Copy size={12} /> 复制命令</>
                  }
                </button>
                <button
                  onClick={() => handleDelete(flow.id)}
                  className="text-muted hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {/* Skill chips */}
            <div className="flex flex-wrap gap-1 mb-3">
              {flow.skill_ids.map(id => (
                <span key={id} className="text-[10px] font-mono bg-bg text-muted px-1.5 py-0.5 rounded border border-border">
                  {id}
                </span>
              ))}
            </div>
            {/* Generated command preview */}
            <pre className="text-[10px] font-mono text-green-400 bg-bg p-2 rounded border border-border overflow-x-auto">
              {generateCommand(flow)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
