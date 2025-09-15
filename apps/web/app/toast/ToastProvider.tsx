'use client'

import React from 'react'

type Toast = { id: number; title?: string; description?: string }

type ToastContextValue = {
  show: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const idRef = React.useRef(1)

  const show = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = idRef.current++
    setToasts((prev) => [...prev, { id, ...toast }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2200)
  }, [])

  const value = React.useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-[1000]">
        {toasts.map((t) => (
          <div key={t.id} className="bg-gray-900 text-white rounded-lg px-4 py-3 shadow-lg min-w-[220px]">
            {t.title ? <div className="text-sm font-semibold">{t.title}</div> : null}
            {t.description ? <div className="text-xs opacity-90 mt-0.5">{t.description}</div> : null}
            {!t.title && !t.description ? <div className="text-sm">Done</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}



