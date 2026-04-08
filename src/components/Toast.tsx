import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
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

/** Typewriter effect for the command portion of a toast message.
 *  Splits on the first '/' or '已复制 ' prefix to animate the command/name portion.
 */
function ToastMessage({ text }: { text: string }) {
  const slashIdx = text.indexOf('/')
  if (slashIdx !== -1) {
    const prefix  = text.slice(0, slashIdx)
    const command = text.slice(slashIdx)
    return (
      <span>
        {prefix && <span className="text-muted">{prefix}</span>}
        <TypewriterCommand text={command} />
      </span>
    )
  }

  // For non-slash messages like "已复制 xxx 安装命令"
  const copyPrefix = '已复制 '
  if (text.startsWith(copyPrefix)) {
    const rest = text.slice(copyPrefix.length)
    return (
      <span>
        <span className="text-muted">{copyPrefix}</span>
        <TypewriterCommand text={rest} />
      </span>
    )
  }

  return <span>{text}</span>
}

function TypewriterCommand({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        // Remove cursor after a short pause
        setTimeout(() => setDone(true), 600)
      }
    }, 18)
    return () => clearInterval(id)
  }, [text])

  return (
    <span className={`font-mono text-code${done ? '' : ' tw-cursor'}`}>
      {displayed}
    </span>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, visible: true })
    // Keep visible long enough for typewriter to finish + short read time
    const copyPrefix = '已复制 '
    let animLen = 0
    if (message.includes('/')) {
      animLen = message.length - message.indexOf('/')
    } else if (message.startsWith(copyPrefix)) {
      animLen = message.length - copyPrefix.length
    }
    const duration = 1400 + animLen * 18
    timerRef.current = setTimeout(() => {
      setToast(t => ({ ...t, visible: false }))
    }, duration)
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
        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2.5 shadow-lg max-w-[min(90vw,480px)]">
          <Check size={13} className="text-accent shrink-0" />
          <span className="text-sm break-all">
            {toast.visible && <ToastMessage text={toast.message} />}
          </span>
        </div>
      </div>
    </ToastContext.Provider>
  )
}
