import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Save, CircleCheckBig, Trash2, WifiOff, X } from 'lucide-react'

export type BannerType = 'save' | 'complete' | 'delete' | 'error' | 'success' | 'info'

export type BannerMessage = {
  id: number
  message: string
  type: BannerType
}

type Props = {
  banners: BannerMessage[]
  onDismiss: (id: number) => void
}

type BannerConfig = {
  accentColor: string
  icon: React.ReactNode
}

function getConfig(type: BannerType): BannerConfig {
  switch (type) {
    case 'save':
    case 'success':
      return {
        accentColor: '#16a34a',
        icon: <Save size={18} style={{ color: '#16a34a' }} className="shrink-0" />,
      }
    case 'complete':
      return {
        accentColor: '#16a34a',
        icon: <CircleCheckBig size={18} style={{ color: '#16a34a' }} className="shrink-0" />,
      }
    case 'delete':
    case 'info':
      return {
        accentColor: '#6b7280',
        icon: <Trash2 size={18} style={{ color: '#6b7280' }} className="shrink-0" />,
      }
    case 'error':
      return {
        accentColor: '#ef4444',
        icon: <WifiOff size={18} style={{ color: '#ef4444' }} className="shrink-0" />,
      }
  }
}

function BannerItem({ banner, onDismiss }: { banner: BannerMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(banner.id), 2500)
    return () => clearTimeout(timer)
  }, [banner.id, onDismiss])

  const config = getConfig(banner.type)

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative bg-white shadow-md border-l-4 overflow-hidden"
      style={{ borderLeftColor: config.accentColor }}
    >
      <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700">
        {config.icon}
        <span className="flex-1">{banner.message}</span>
        <button
          type="button"
          onClick={() => onDismiss(banner.id)}
          className="shrink-0 text-gray-400 hover:text-gray-600"
          aria-label="閉じる"
        >
          <X size={16} />
        </button>
      </div>
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 2.5, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-0.5"
        style={{ backgroundColor: config.accentColor }}
      />
    </motion.div>
  )
}

export function Banner({ banners, onDismiss }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <AnimatePresence>
        {banners.map((banner) => (
          <BannerItem key={banner.id} banner={banner} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}

let bannerCounter = 0

export function createBanner(message: string, type: BannerType = 'save'): BannerMessage {
  return { id: ++bannerCounter, message, type }
}
