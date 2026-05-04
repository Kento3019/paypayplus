import { motion } from 'framer-motion'
import { Wallet, Check } from 'lucide-react'
import { navigateToHash } from '../lib/routing'
import { AppLogo } from '../components/AppLogo'

export function WelcomePage() {
  function handleCreateRoom() {
    navigateToHash('create')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          className="mb-8"
        >
          <AppLogo size="lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet size={48} className="text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-6 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 whitespace-pre-line">
            {'2人の支払いを\nかんたん管理'}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full bg-white rounded-xl p-4 space-y-3 mb-8"
        >
          <div className="flex items-center gap-3">
            <Check size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm text-gray-700">ログイン不要・URLを共有するだけ</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm text-gray-700">誰が払ったかひと目でわかる</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm text-gray-700">PayPayリンクを記録できる</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="w-full"
        >
          <motion.button
            onClick={handleCreateRoom}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 rounded-xl bg-primary text-white text-base font-bold shadow-md hover:bg-primary-dark active:bg-primary-darker transition-colors"
          >
            新しいルームを作る
          </motion.button>

          <p className="mt-6 text-sm text-gray-400 leading-relaxed text-center">
            ルームのURLを受け取ったらそのままアクセスしてね
          </p>
        </motion.div>

      </div>
    </div>
  )
}
