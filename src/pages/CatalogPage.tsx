import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import pluginsData from '../data/plugins.json'
import skillsData from '../data/skills.json'
import type { Plugin, Skill } from '../types'
import PluginHeader from '../components/PluginHeader'
import SkillCard from '../components/SkillCard'

const plugins = pluginsData as Plugin[]
const skills = skillsData as Skill[]
const skillMap = Object.fromEntries(skills.map(s => [s.id, s]))

export default function CatalogPage() {
  const [selectedPluginId, setSelectedPluginId] = useState<string>(plugins[0]?.id ?? '')
  const [query, setQuery] = useState('')

  const selectedPlugin = plugins.find(p => p.id === selectedPluginId) ?? plugins[0]

  const pluginSkills = useMemo(() => {
    return selectedPlugin.skill_ids
      .map(id => skillMap[id])
      .filter(Boolean) as Skill[]
  }, [selectedPlugin])

  const filteredSkills = useMemo(() => {
    if (!query.trim()) return pluginSkills
    const q = query.toLowerCase()
    return pluginSkills.filter(
      s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    )
  }, [pluginSkills, query])

  return (
    <div className="flex gap-0 min-h-[600px]">
      {/* Left sidebar */}
      <nav className="w-44 shrink-0 border-r border-border pr-4 mr-6">
        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">插件包</p>
        <ul className="space-y-0.5">
          {plugins.map(plugin => (
            <li key={plugin.id}>
              <button
                onClick={() => { setSelectedPluginId(plugin.id); setQuery('') }}
                className={`w-full text-left px-3 py-2 rounded text-sm font-mono transition-colors ${
                  plugin.id === selectedPluginId
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-text hover:bg-surface'
                }`}
              >
                {plugin.name}
                <span className="block text-[10px] opacity-60 mt-0.5">
                  {plugin.skill_ids.length} skills
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="relative mb-5">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={`搜索 ${selectedPlugin.name} skills...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm
                       text-text placeholder-muted outline-none focus:border-accent transition-colors font-mono"
          />
        </div>

        <PluginHeader
          plugin={selectedPlugin}
          skillCount={selectedPlugin.skill_ids.length}
        />

        <p className="text-xs text-muted mb-4 font-mono">
          {filteredSkills.length} / {pluginSkills.length} skills
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              pluginId={selectedPlugin.id === 'local' ? undefined : selectedPlugin.id}
            />
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <p className="text-sm text-muted font-mono text-center py-12">
            没有匹配的 skill
          </p>
        )}
      </div>
    </div>
  )
}
