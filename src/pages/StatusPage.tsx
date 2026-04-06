import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import skillsData from '../data/skills.json'
import type { Skill } from '../types'
import { parseInstalledSkills } from '../lib/parser'

const skills = skillsData as Skill[]

export default function StatusPage() {
  const [raw, setRaw] = useState('')
  const [result, setResult] = useState<{ installed: Skill[]; missing: Skill[] } | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function handleCheck() {
    const installedIds = new Set(parseInstalledSkills(raw))
    const installed = skills.filter(s => installedIds.has(s.id))
    const missing = skills.filter(s => !installedIds.has(s.id))
    setResult({ installed, missing })
  }

  async function handleCopy(skill: Skill) {
    await navigator.clipboard.writeText(skill.install_command)
    setCopiedId(skill.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <label className="block text-sm font-mono text-muted mb-2">
          将 <code className="text-accent">claude plugin list</code> 的输出粘贴到这里：
        </label>
        <textarea
          value={raw}
          onChange={e => setRaw(e.target.value)}
          placeholder={'frontend-design@anthropics (1.0.0)\nmcp-builder@anthropics (2.1.0)\n...'}
          rows={6}
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-xs font-mono
                     text-text placeholder-muted/50 outline-none focus:border-accent transition-colors resize-none"
        />
        <button
          onClick={handleCheck}
          disabled={!raw.trim()}
          className="mt-3 text-sm bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed
                     text-white px-4 py-2 rounded font-mono transition-colors"
        >
          检测安装状态
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Installed */}
          <div>
            <h3 className="font-mono text-sm font-semibold text-green-400 mb-3">
              ✅ 已安装 ({result.installed.length})
            </h3>
            {result.installed.length === 0
              ? <p className="text-xs text-muted font-mono">无</p>
              : (
                <div className="flex flex-wrap gap-1.5">
                  {result.installed.map(s => (
                    <span key={s.id} className="text-xs font-mono bg-green-900/20 text-green-400 border border-green-900/40 px-2 py-1 rounded">
                      {s.name}
                    </span>
                  ))}
                </div>
              )
            }
          </div>

          {/* Missing */}
          <div>
            <h3 className="font-mono text-sm font-semibold text-red-400 mb-3">
              ❌ 未安装 ({result.missing.length})
            </h3>
            {result.missing.length === 0
              ? <p className="text-xs text-muted font-mono">全部已安装！</p>
              : (
                <div className="space-y-2">
                  {result.missing.map(s => (
                    <div key={s.id} className="flex items-center justify-between bg-surface border border-border rounded px-3 py-2">
                      <div>
                        <span className="text-xs font-mono text-text">{s.name}</span>
                        <span className="text-[10px] text-muted ml-2">{s.description}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(s)}
                        className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors font-mono shrink-0 ml-3"
                      >
                        {copiedId === s.id
                          ? <><Check size={11} className="text-green-400" /> 已复制</>
                          : <><Copy size={11} /> 复制安装</>
                        }
                      </button>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  )
}
