import { useState } from 'react'
import CatalogPage from './pages/CatalogPage'
import FlowsPage from './pages/FlowsPage'
import { ToastProvider } from './components/Toast'

type Tab = 'catalog' | 'flows'

const tabs: { id: Tab; label: string }[] = [
  { id: 'catalog', label: 'Skill 目录' },
  { id: 'flows', label: 'Skill 流' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog')
  const [isDark, setIsDark] = useState(true)

  return (
    <ToastProvider>
    <div className={`min-h-screen bg-bg text-text font-sans${isDark ? '' : ' light'}`}>
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-display italic text-xl sm:text-3xl font-semibold text-accent shrink-0">
            AI Skill 看板
          </h1>
          <div className="flex items-center gap-1 sm:gap-3">
            <nav aria-label="主导航" className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`px-2 sm:px-4 py-3 text-sm font-mono transition-colors duration-150 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-accent text-text'
                      : 'border-transparent text-muted hover:text-text hover:border-border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <button
              onClick={() => setIsDark(d => !d)}
              title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
              aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
              className="w-11 h-11 flex items-center justify-center rounded text-muted hover:text-text hover:bg-surface transition-colors duration-150"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div key={activeTab} className="animate-fade-in">
          {activeTab === 'catalog' && <CatalogPage />}
          {activeTab === 'flows' && <FlowsPage />}
        </div>
      </main>
    </div>
    </ToastProvider>
  )
}
