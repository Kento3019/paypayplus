import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { resolveRoute, getCurrentHash } from './lib/routing'
import { RoomPage } from './pages/RoomPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { WelcomePage } from './pages/WelcomePage'
import { CreateRoomPage } from './pages/CreateRoomPage'
import { ShareLinkPage } from './pages/ShareLinkPage'
import { SettingsPage } from './pages/SettingsPage'

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

function stateKey(state: AppState): string {
  switch (state.status) {
    case 'room':
      return `room-${state.roomId}`
    case 'share':
      return `share-${state.roomId}`
    case 'settings':
      return `settings-${state.roomId}`
    default:
      return state.status
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

  function renderPage(s: AppState) {
    switch (s.status) {
      case 'welcome':
        return <WelcomePage />
      case 'create':
        return <CreateRoomPage />
      case 'share':
        return <ShareLinkPage roomId={s.roomId} />
      case 'settings':
        return (
          <SettingsPage
            roomId={s.roomId}
            onNotFound={() => setState({ status: 'notFound' })}
          />
        )
      case 'room':
        return <RoomPage roomId={s.roomId} />
      case 'notFound':
      default:
        return <NotFoundPage />
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateKey(state)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderPage(state)}
      </motion.div>
    </AnimatePresence>
  )
}
