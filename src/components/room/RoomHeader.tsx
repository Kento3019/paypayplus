import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppLogo } from '../AppLogo'
import { MSG } from '../../lib/messages'

type Props = {
  roomId: string
}

export function RoomHeader({ roomId }: Props) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between mb-4">
      <AppLogo size="sm" />
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/settings/${roomId}`)}
        className="text-gray-500 hover:text-gray-700 p-1"
        aria-label={MSG.room.settingsLabel}
      >
        <Settings size={22} />
      </motion.button>
    </div>
  )
}
