import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Check } from 'lucide-react'

interface ToastState {
  message: string
  visible: boolean
}

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, visible: true })
    timerRef.current = setTimeout(() => {
      setToast(t => ({ ...t, visible: false }))
    }, 2000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-[opacity,transform] duration-200 ${
          toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2.5 shadow-lg max-w-[min(90vw,420px)]">
          <Check size={13} className="text-code shrink-0" />
          <span className="text-sm font-mono text-text break-all">{toast.message}</span>
        </div>
      </div>
    </ToastContext.Provider>
  )
}
