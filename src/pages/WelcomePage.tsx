import { motion } from 'framer-motion'
import { Wallet, Check, PlusCircle, Share2, ListPlus, ChevronRight } from 'lucide-react'
import { navigateToHash } from '../lib/routing'
import { AppLogo } from '../components/AppLogo'

export function WelcomePage() {
  function handleCreateRoom() {
    navigateToHash('create')
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
            {'2人の支払いを\nかんたん管理'}
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
          transition={{ duration: 0.4, delay: 0.35 }}
          className="w-full mb-4"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center mb-3">
            使い方
          </p>
          <div className="flex items-start justify-between gap-1">
            {[
              { icon: PlusCircle, title: 'ルーム作成', desc: '「作る」ボタンをタップ' },
              { icon: Share2, title: 'URLを共有', desc: 'メンバーにURLを送る' },
              { icon: ListPlus, title: '立替を記録', desc: '＋ボタンで追加する' },
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
          <motion.button
            onClick={handleCreateRoom}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 rounded-xl bg-primary text-white text-base font-bold shadow-md hover:bg-primary-dark active:bg-primary-darker transition-colors"
          >
            新しいルームを作る
          </motion.button>

          <p className="mt-4 text-sm text-gray-400 leading-relaxed text-center">
            ルームのURLを受け取ったらそのままアクセスしてね
          </p>
        </motion.div>

      </div>
    </div>
  )
}
