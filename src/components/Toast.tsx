import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCircle2, Trash2, WifiOff } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'complete' | 'delete'

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
  useEffect(() => {
    const removeTimer = setTimeout(() => onDismiss(toast.id), 2500)
    return () => clearTimeout(removeTimer)
  }, [toast.id, onDismiss])

  const config: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
    success: {
      bg: '#1B5E20',
      icon: <Check size={18} className="text-green-300 shrink-0" />,
    },
    complete: {
      bg: '#1B5E20',
      icon: <CheckCircle2 size={18} className="text-green-300 shrink-0" />,
    },
    delete: {
      bg: '#B71C1C',
      icon: <Trash2 size={18} className="text-white shrink-0" />,
    },
    error: {
      bg: '#37474F',
      icon: <WifiOff size={18} className="text-white shrink-0" />,
    },
  }

  const { bg, icon } = config[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2 text-white text-sm px-4 py-3 rounded-xl shadow-xl"
      style={{ backgroundColor: bg }}
    >
      {icon}
      <span>{toast.message}</span>
    </motion.div>
  )
}

export function Toast({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50 pointer-events-none items-center">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

let toastCounter = 0

export function createToast(message: string, type: ToastType = 'success'): ToastMessage {
  return { id: ++toastCounter, message, type }
}
