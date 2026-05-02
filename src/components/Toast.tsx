import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error'

export type ToastMessage = {
  id: number
  message: string
  type: ToastType
}

type Props = {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hideTimer = setTimeout(() => setVisible(false), 2500)
    const removeTimer = setTimeout(() => onDismiss(toast.id), 3000)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [toast.id, onDismiss])

  const bg = toast.type === 'error' ? 'bg-red-600' : 'bg-gray-800'

  return (
    <div
      className={`${bg} text-white text-sm px-4 py-3 rounded-lg shadow-lg transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {toast.message}
    </div>
  )
}

export function Toast({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

let toastCounter = 0

export function createToast(message: string, type: ToastType = 'success'): ToastMessage {
  return { id: ++toastCounter, message, type }
}
