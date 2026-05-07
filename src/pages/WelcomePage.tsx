import { Wallet, Check, PlusCircle, Share2, ListPlus, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppLogo } from '../components/AppLogo'
import { MotionButton } from '../components/ui/MotionButton'
import { MSG } from '../lib/messages'

export function WelcomePage() {
  const navigate = useNavigate()

  function handleCreateRoom() {
    navigate('/create')
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="mb-6"
        >
          <AppLogo size="lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet size={36} className="text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-4 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 whitespace-pre-line">
            {MSG.welcome.headline}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full bg-white rounded-xl p-4 space-y-3 mb-4"
        >
          <div className="flex items-center gap-3">
            <Check size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm text-gray-700">{MSG.welcome.feature1}</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm text-gray-700">{MSG.welcome.feature2}</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm text-gray-700">{MSG.welcome.feature3}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="w-full mb-4"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
            {MSG.welcome.howToUse}
          </p>
          <div className="flex items-start justify-between gap-1">
            {[
              { icon: PlusCircle, title: MSG.welcome.step1Title, desc: MSG.welcome.step1Desc },
              { icon: Share2, title: MSG.welcome.step2Title, desc: MSG.welcome.step2Desc },
              { icon: ListPlus, title: MSG.welcome.step3Title, desc: MSG.welcome.step3Desc },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-start gap-1 flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-2 relative">
                    <Icon size={20} className="text-primary" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{title}</p>
                  <p className="text-[10px] text-gray-400 text-center leading-tight mt-0.5">{desc}</p>
                </div>
                {i < 2 && (
                  <ChevronRight size={14} className="text-gray-300 mt-3 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-full"
        >
          <MotionButton
            onClick={handleCreateRoom}
            className="w-full py-4 rounded-xl text-base font-bold shadow-md transition-colors"
          >
            {MSG.welcome.createButton}
          </MotionButton>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed text-center">
            {MSG.welcome.shareHint}
          </p>
        </motion.div>

      </div>
    </div>
  )
}
