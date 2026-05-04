import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { getRoom, updateRoom } from '../lib/firestore'
import type { Member } from '../types'
import { navigateToHash } from '../lib/routing'
import { AppLogo } from '../components/AppLogo'

type Props = {
  roomId: string
  onNotFound: () => void
}

export function SettingsPage({ roomId, onNotFound }: Props) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [error1, setError1] = useState<string | undefined>()
  const [error2, setError2] = useState<string | undefined>()
  const [members, setMembers] = useState<[Member, Member] | null>(null)

  useEffect(() => {
    getRoom(roomId).then((room) => {
      if (!room) {
        onNotFound()
        return
      }
      setMembers(room.members)
      setName1(room.members[0].name)
      setName2(room.members[1].name)
      setLoading(false)
    })
  }, [roomId, onNotFound])

  function validateName(value: string): string | undefined {
    if (value.trim() === '') return '名前を入力してください'
    if (value.length > 10) return '名前は10文字以内で入力してください'
    return undefined
  }

  async function handleSave() {
    const e1 = validateName(name1)
    const e2 = validateName(name2)
    setError1(e1)
    setError2(e2)
    if (e1 || e2 || !members) return

    setSaving(true)
    try {
      const updatedMembers: [Member, Member] = [
        { ...members[0], name: name1.trim() },
        { ...members[1], name: name2.trim() },
      ]
      await updateRoom(roomId, updatedMembers)
      navigateToHash(roomId)
    } catch {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-400 text-sm">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppLogo size="sm" className="mb-4" />
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={() => navigateToHash(roomId)}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-gray-900"
            aria-label="戻る"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <h1 className="text-lg font-semibold text-gray-800">メンバーを編集</h1>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">メンバー1の名前</label>
            <input
              type="text"
              value={name1}
              onChange={(e) => {
                setName1(e.target.value)
                if (error1) setError1(validateName(e.target.value))
              }}
              maxLength={10}
              className={`w-full border rounded px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/50 ${
                error1 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error1 && <p className="text-red-500 text-xs mt-1">{error1}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">メンバー2の名前</label>
            <input
              type="text"
              value={name2}
              onChange={(e) => {
                setName2(e.target.value)
                if (error2) setError2(validateName(e.target.value))
              }}
              maxLength={10}
              className={`w-full border rounded px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/50 ${
                error2 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error2 && <p className="text-red-500 text-xs mt-1">{error2}</p>}
          </div>

          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark active:bg-primary-darker disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存する'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
