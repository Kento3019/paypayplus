import { useEffect, useState } from 'react'
import { resolveRoute, navigateToHash, getCurrentHash } from './lib/routing'
import { RoomPage } from './pages/RoomPage'
import { NotFoundPage } from './pages/NotFoundPage'

type AppState =
  | { status: 'loading' }
  | { status: 'room'; roomId: string }
  | { status: 'notFound' }

function resolveState(hash: string): AppState {
  const result = resolveRoute(hash)
  if (result.type === 'redirect') {
    navigateToHash(result.roomId)
    return { status: 'loading' }
  }
  if (result.type === 'room') {
    return { status: 'room', roomId: result.roomId }
  }
  return { status: 'notFound' }
}

export function App() {
  const [state, setState] = useState<AppState>(() =>
    resolveState(getCurrentHash())
  )

  useEffect(() => {
    const handler = () => {
      setState(resolveState(getCurrentHash()))
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-400">リダイレクト中...</p>
      </div>
    )
  }

  if (state.status === 'notFound') {
    return <NotFoundPage />
  }

  return <RoomPage roomId={state.roomId} />
}
