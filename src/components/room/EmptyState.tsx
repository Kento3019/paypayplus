import { motion } from 'framer-motion'
import { Wallet, ArrowDownRight } from 'lucide-react'
import { MSG } from '../../lib/messages'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center text-center py-12 px-6"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Wallet size={40} className="text-primary" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-2">{MSG.room.emptyTitle}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        {MSG.room.emptyDescPrefix}
        <span className="font-bold text-primary">{MSG.room.emptyDescHighlight}</span>
        {MSG.room.emptyDescSuffix}
        <br />{MSG.room.emptyDescLine2}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <ArrowDownRight size={14} />
        <span>{MSG.room.emptyHint}</span>
      </div>
    </motion.div>
  )
}
