import { useState } from 'react'
import { motion } from 'framer-motion'
import { createRoom } from '../lib/firestore'
import { generateRandomHash, navigateToHash } from '../lib/routing'
import { Toast, createToast } from '../components/Toast'
import type { ToastMessage } from '../components/Toast'
import type { Member } from '../types'
import { AppLogo } from '../components/AppLogo'

type FormErrors = {
  member1?: string
  member2?: string
}

export function CreateRoomPage() {
  const [member1Name, setMember1Name] = useState('')
  const [member2Name, setMember2Name] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [creating, setCreating] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToasts((prev) => [...prev, createToast(message, type)])
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (member1Name.trim() === '') errs.member1 = '名前を入力してください'
    if (member2Name.trim() === '') errs.member2 = '名前を入力してください'
    return errs
  }

  async function handleCreate() {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setCreating(true)
    try {
      const roomId = generateRandomHash()
      const members: [Member, Member] = [
        { id: 'm1', name: member1Name.trim(), color: '#2196F3' },
        { id: 'm2', name: member2Name.trim(), color: '#F44336' },
      ]
      await createRoom(roomId, members)
      navigateToHash(`share/${roomId}`)
    } catch {
      setCreating(false)
      showToast('通信エラーが発生しました', 'error')
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <Toast toasts={toasts} onDismiss={dismissToast} />
      <div className="w-full max-w-sm">
        <AppLogo size="sm" className="mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">ルームを作成</h1>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            メンバー1の名前
          </label>
          <input
            type="text"
            value={member1Name}
            onChange={(e) => {
              setMember1Name(e.target.value)
              if (errors.member1) setErrors((prev) => ({ ...prev, member1: undefined }))
            }}
            maxLength={10}
            placeholder="太郎"
            className={`w-full border rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50 bg-white ${
              errors.member1 ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.member1 && (
            <p className="text-red-500 text-xs mt-1">{errors.member1}</p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            メンバー2の名前
          </label>
          <input
            type="text"
            value={member2Name}
            onChange={(e) => {
              setMember2Name(e.target.value)
              if (errors.member2) setErrors((prev) => ({ ...prev, member2: undefined }))
            }}
            maxLength={10}
            placeholder="花子"
            className={`w-full border rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50 bg-white ${
              errors.member2 ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.member2 && (
            <p className="text-red-500 text-xs mt-1">{errors.member2}</p>
          )}
        </div>

        <motion.button
          onClick={handleCreate}
          disabled={creating}
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 rounded-xl bg-primary text-white text-base font-bold shadow-md hover:bg-primary-dark active:bg-primary-darker transition-colors disabled:opacity-50"
        >
          {creating ? '作成中...' : 'ルームを作成する'}
        </motion.button>
      </div>
    </div>
  )
}
