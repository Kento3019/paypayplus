import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getRoom } from '../lib/firestore'
import { navigateToHash } from '../lib/routing'
import { NotFoundPage } from './NotFoundPage'
import { AppLogo } from '../components/AppLogo'

type Props = {
  roomId: string
}

export function ShareLinkPage({ roomId }: Props) {
  const [loading, setLoading] = useState(true)
  const [exists, setExists] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [copied, setCopied] = useState(false)

  const roomUrl = `${window.location.origin}/#${roomId}`

  useEffect(() => {
    getRoom(roomId)
      .then((room) => {
        setExists(room !== null)
        setLoading(false)
      })
      .catch(() => {
        setLoadError(true)
        setLoading(false)
      })
  }, [roomId])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = roomUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleEnterRoom() {
    navigateToHash(roomId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">このルームにアクセスできません</h1>
          <p className="text-sm text-gray-500">通信エラーが発生しました。時間をおいて再度お試しください。</p>
        </div>
      </div>
    )
  }

  if (!exists) {
    return <NotFoundPage />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <AppLogo size="sm" className="mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">URLを共有してね</h1>
        <p className="text-sm text-gray-500 mb-8">このURLをメンバーに共有してね</p>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 text-left">
          <p className="text-sm text-gray-600 break-all">{roomUrl}</p>
        </div>

        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-xl text-base font-bold shadow-sm transition-all mb-4 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-white border border-primary text-primary hover:bg-primary/10'
          }`}
        >
          {copied ? 'コピーした！ ✓' : 'コピー'}
        </motion.button>

        <motion.button
          onClick={handleEnterRoom}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-xl bg-primary text-white text-base font-bold shadow-md hover:bg-primary-dark active:bg-primary-darker transition-colors"
        >
          ルームへ入る
        </motion.button>
      </div>
    </div>
  )
}
