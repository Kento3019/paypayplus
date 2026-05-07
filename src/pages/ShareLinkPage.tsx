import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoom } from '../lib/firestore'
import { NotFoundPage } from './NotFoundPage'
import { AppLogo } from '../components/AppLogo'
import { MotionButton } from '../components/ui/MotionButton'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { MSG } from '../lib/messages'

type PageState = 'loading' | 'ready' | 'not_found' | 'error'

export function ShareLinkPage() {
  const { roomId = '' } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [copied, setCopied] = useState(false)

  const roomUrl = `${window.location.origin}/#/share/${roomId}`

  useEffect(() => {
    getRoom(roomId)
      .then((room) => setPageState(room !== null ? 'ready' : 'not_found'))
      .catch(() => setPageState('error'))
  }, [roomId])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(roomUrl)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = roomUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (pageState === 'loading') return <LoadingScreen />

  if (pageState === 'error') {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{MSG.shareLink.accessError}</h1>
          <p className="text-sm text-gray-500">{MSG.shareLink.accessErrorDetail}</p>
        </div>
      </div>
    )
  }

  if (pageState === 'not_found') {
    return <NotFoundPage />
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <AppLogo size="sm" className="mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{MSG.shareLink.title}</h1>
        <p className="text-sm text-gray-500 mb-8">{MSG.shareLink.subtitle}</p>

        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 text-left">
          <p className="text-sm text-gray-600 break-all">{roomUrl}</p>
        </div>

        <MotionButton
          onClick={handleCopy}
          variant={copied ? 'primary' : 'secondary'}
          className={`w-full py-3 rounded-xl text-base font-bold shadow-sm transition-all mb-4 ${
            copied ? 'bg-green-500 border-green-500' : 'border-primary text-primary hover:bg-primary/10'
          }`}
        >
          {copied ? MSG.shareLink.copied : MSG.shareLink.copy}
        </MotionButton>

        <MotionButton
          onClick={() => navigate(`/${roomId}`)}
          className="w-full py-4 rounded-xl text-base font-bold shadow-md transition-colors"
        >
          {MSG.shareLink.enterRoom}
        </MotionButton>
      </div>
    </div>
  )
}
