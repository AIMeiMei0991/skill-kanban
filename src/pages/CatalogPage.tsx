import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import skillsData from '../data/skills.json'
import type { Skill } from '../types'
import SkillCard from '../components/SkillCard'
import SkillDetail from '../components/SkillDetail'

const skills = skillsData as Skill[]
const allTags = [...new Set(skills.flatMap(s => s.tags))].sort()

export default function CatalogPage() {
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Skill | null>(null)

  const filtered = useMemo(() => {
    return skills.filter(skill => {
      const matchesQuery =
        query === '' ||
        skill.name.toLowerCase().includes(query.toLowerCase()) ||
        skill.description.toLowerCase().includes(query.toLowerCase())
      const matchesTags =
        activeTags.size === 0 || skill.tags.some(t => activeTags.has(t))
      return matchesQuery && matchesTags
    })
  }, [query, activeTags])

  function toggleTag(tag: string) {
    setActiveTags(prev => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  return (
    <div className="flex gap-6">
      {/* Left: catalog */}
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="搜索 skill..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm
                       text-text placeholder-muted outline-none focus:border-accent transition-colors font-mono"
          />
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors ${
                activeTags.has(tag)
                  ? 'bg-accent border-accent text-white'
                  : 'bg-surface border-border text-muted hover:text-text hover:border-accent/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted mb-4 font-mono">
          {filtered.length} / {skills.length} skills
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Right: detail panel */}
      {selected && (
        <div className="w-80 shrink-0">
          <SkillDetail skill={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  )
}
