import { useState } from 'react'
import CatalogPage from './pages/CatalogPage'
import FlowsPage from './pages/FlowsPage'
import StatusPage from './pages/StatusPage'

type Tab = 'catalog' | 'flows' | 'status'

const tabs: { id: Tab; label: string }[] = [
  { id: 'catalog', label: 'Skill 目录' },
  { id: 'flows', label: 'Skill 流' },
  { id: 'status', label: '安装状态' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog')

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-mono text-xl font-semibold text-accent">
            AI Skill 看板
          </h1>
          <nav className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded text-sm font-mono transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-text hover:bg-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'catalog' && <CatalogPage />}
        {activeTab === 'flows' && <FlowsPage />}
        {activeTab === 'status' && <StatusPage />}
      </main>
    </div>
  )
}
