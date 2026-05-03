import { motion } from 'framer-motion'
import { navigateToHash } from '../lib/routing'

export function WelcomePage() {
  function handleCreateRoom() {
    navigateToHash('create')
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PayPay+</h1>
          <p className="text-lg text-[#2196F3] font-medium mb-4">2人の支払いをかんたん管理</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            「いくら払えばいい？」をなくす。<br />
            2人専用・ログインなし・URLを共有するだけ。
          </p>
        </div>

        <motion.button
          onClick={handleCreateRoom}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-xl bg-[#2196F3] text-white text-base font-bold shadow-md hover:bg-blue-600 active:bg-blue-700 transition-colors"
        >
          新しいルームを作る
        </motion.button>

        <p className="mt-8 text-xs text-gray-400 leading-relaxed">
          ルームのURLを受け取ったら<br />
          そのままアクセスしてね
        </p>
      </div>
    </div>
  )
}
