import { useEffect, useState } from 'react'
import { resolveRoute, getCurrentHash } from './lib/routing'
import { RoomPage } from './pages/RoomPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { WelcomePage } from './pages/WelcomePage'
import { CreateRoomPage } from './pages/CreateRoomPage'
import { ShareLinkPage } from './pages/ShareLinkPage'

type AppState =
  | { status: 'welcome' }
  | { status: 'create' }
  | { status: 'share'; roomId: string }
  | { status: 'settings'; roomId: string }
  | { status: 'room'; roomId: string }
  | { status: 'notFound' }

function resolveState(hash: string): AppState {
  const result = resolveRoute(hash)
  switch (result.type) {
    case 'welcome':
      return { status: 'welcome' }
    case 'create':
      return { status: 'create' }
    case 'share':
      return { status: 'share', roomId: result.roomId }
    case 'settings':
      return { status: 'settings', roomId: result.roomId }
    case 'room':
      return { status: 'room', roomId: result.roomId }
    case 'notFound':
    default:
      return { status: 'notFound' }
  }
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

  switch (state.status) {
    case 'welcome':
      return <WelcomePage />
    case 'create':
      return <CreateRoomPage />
    case 'share':
      return <ShareLinkPage roomId={state.roomId} />
    case 'settings':
      return <NotFoundPage />
    case 'room':
      return <RoomPage roomId={state.roomId} />
    case 'notFound':
    default:
      return <NotFoundPage />
  }
}
