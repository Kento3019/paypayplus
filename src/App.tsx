import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { RoomPage } from './pages/RoomPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { WelcomePage } from './pages/WelcomePage'
import { CreateRoomPage } from './pages/CreateRoomPage'
import { ShareLinkPage } from './pages/ShareLinkPage'
import { SettingsPage } from './pages/SettingsPage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/create" element={<CreateRoomPage />} />
          <Route path="/share/:roomId" element={<ShareLinkPage />} />
          <Route path="/settings/:roomId" element={<SettingsPage />} />
          <Route path="/:roomId" element={<RoomPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export function App() {
  return <AnimatedRoutes />
}
