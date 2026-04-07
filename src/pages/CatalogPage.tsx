import { useState, useMemo, useRef } from 'react'
import { Search, GripVertical, X, SearchX } from 'lucide-react'
import pluginsData from '../data/plugins.json'
import skillsData from '../data/skills.json'
import type { Plugin, Skill } from '../types'
import PluginHeader from '../components/PluginHeader'
import SkillCard from '../components/SkillCard'

const plugins = pluginsData as Plugin[]
const skills = skillsData as Skill[]
const skillMap = Object.fromEntries(skills.map(s => [s.id, s]))

function groupByCategory(skills: Skill[]): Map<string, Skill[]> {
  const map = new Map<string, Skill[]>()
  for (const s of skills) {
    const key = s.category ?? '其他'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  return map
}

export default function CatalogPage() {
  const [selectedPluginId, setSelectedPluginId] = useState<string>(plugins[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [pluginOrder, setPluginOrder] = useState<Plugin[]>(plugins)
  const dragIndexRef = useRef<number | null>(null)
  const dragOverIndexRef = useRef<number | null>(null)

  const selectedPlugin = pluginOrder.find(p => p.id === selectedPluginId) ?? pluginOrder[0]

  function handleDragStart(index: number) {
    dragIndexRef.current = index
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    dragOverIndexRef.current = index
  }

  function handleDrop() {
    const from = dragIndexRef.current
    const to = dragOverIndexRef.current
    if (from === null || to === null || from === to) return
    const next = [...pluginOrder]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setPluginOrder(next)
    dragIndexRef.current = null
    dragOverIndexRef.current = null
  }

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

  const hasCategories = filteredSkills.some(s => s.category)
  const grouped = useMemo(
    () => hasCategories ? groupByCategory(filteredSkills) : null,
    [filteredSkills, hasCategories]
  )

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:min-h-[600px]">
      {/* Plugin selector — 手机横向滚动，桌面侧边栏 */}
      <nav aria-label="插件包列表" className="sm:w-44 sm:shrink-0 sm:border-r sm:border-border sm:pr-4 mb-4 sm:mb-0">
        <p className="text-xs text-muted uppercase tracking-wider mb-3 hidden sm:block">插件包</p>

        {/* 手机：横向 pill 滚动 */}
        <div className="flex sm:hidden gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-none">
          {pluginOrder.map(plugin => (
            <button
              key={plugin.id}
              onClick={() => setSelectedPluginId(plugin.id)}
              className={`shrink-0 min-h-[44px] px-3 py-2 rounded-full text-sm font-mono whitespace-nowrap transition-colors ${
                plugin.id === selectedPluginId
                  ? 'bg-accent text-white'
                  : 'bg-surface text-muted border border-border'
              }`}
            >
              {plugin.name}
            </button>
          ))}
        </div>

        {/* 桌面：可拖拽纵向列表 */}
        <ul className="hidden sm:block space-y-0.5">
          {pluginOrder.map((plugin, index) => (
            <li
              key={plugin.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDrop={handleDrop}
              className="flex items-stretch group"
            >
              <div className="flex items-center px-1 cursor-grab opacity-20 group-hover:opacity-60 hover:!opacity-90 transition-opacity text-muted shrink-0">
                <GripVertical size={12} />
              </div>
              <button
                onClick={() => { setSelectedPluginId(plugin.id) }}
                className={`flex-1 text-left py-2 pr-2 text-sm font-mono transition-colors duration-150 border-l-2 pl-[6px] rounded-r ${
                  plugin.id === selectedPluginId
                    ? 'border-accent text-text'
                    : 'border-transparent text-muted hover:text-text hover:border-border'
                }`}
              >
                <span className="flex items-center justify-between gap-2 min-w-0">
                  <span className="truncate">{plugin.name}</span>
                  <span className="text-[10px] opacity-50 tabular-nums shrink-0">{plugin.skill_ids.length}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="relative mb-5">
          <label htmlFor="skill-search" className="sr-only">搜索 Skills</label>
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            id="skill-search"
            type="text"
            placeholder={`搜索 ${selectedPlugin.name} skills...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={`w-full bg-surface border border-border rounded-lg pl-9 py-2.5 sm:py-2 text-sm text-text placeholder-muted outline-none focus:border-accent transition-colors duration-150 ${query ? 'pr-8' : 'pr-4'}`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="清空搜索"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors duration-150 p-0.5 rounded"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <PluginHeader
          plugin={selectedPlugin}
          skillCount={selectedPlugin.skill_ids.length}
        />

        {query.trim() && (
          <p className="text-xs text-muted mb-4">
            找到 {filteredSkills.length} / {pluginSkills.length} 个 skill
          </p>
        )}

        {grouped ? (
          <div className="space-y-8">
            {Array.from(grouped.entries()).map(([category, catSkills]) => (
              <div key={category}>
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="font-display italic text-xl text-muted/80 shrink-0">
                    {category}
                  </h3>
                  <span className="text-[10px] font-mono text-muted/40 shrink-0">{catSkills.length}</span>
                  <div className="flex-1 border-t border-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catSkills.map((skill, i) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      pluginId={selectedPlugin.id === 'local' ? undefined : selectedPlugin.id}
                      featured={i === 0}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSkills.map((skill, i) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                pluginId={selectedPlugin.id === 'local' ? undefined : selectedPlugin.id}
                index={i}
              />
            ))}
          </div>
        )}

        {filteredSkills.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <SearchX size={32} className="text-muted/40 mb-3" />
            <p className="text-sm text-muted mb-1">没有匹配「{query}」的 skill</p>
            <p className="text-xs text-muted/50">尝试其他关键词，或
              <button onClick={() => setQuery('')} className="text-accent hover:text-accent/80 transition-colors duration-150 ml-1">
                清空搜索
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
