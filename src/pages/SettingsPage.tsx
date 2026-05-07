import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRoom, updateRoom } from '../lib/firestore'
import type { Member } from '../types'
import { AppLogo } from '../components/AppLogo'
import { MSG } from '../lib/messages'
import { NotFoundPage } from './NotFoundPage'

type FormErrors = { member1?: string; member2?: string }

export function SettingsPage() {
  const { roomId = '' } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [members, setMembers] = useState<[Member, Member] | null>(null)

  useEffect(() => {
    getRoom(roomId).then((room) => {
      if (!room) {
        setNotFound(true)
        return
      }
      setMembers(room.members)
      setName1(room.members[0].name)
      setName2(room.members[1].name)
      setLoading(false)
    })
  }, [roomId])

  function validateName(value: string): string | undefined {
    if (value.trim() === '') return MSG.validation.nameRequired
    if (value.length > 10) return MSG.validation.nameMaxLength
    return undefined
  }

  async function handleSave() {
    const e1 = validateName(name1)
    const e2 = validateName(name2)
    setErrors({ member1: e1, member2: e2 })
    if (e1 || e2 || !members) return

    setSaving(true)
    try {
      const updatedMembers: [Member, Member] = [
        { ...members[0], name: name1.trim() },
        { ...members[1], name: name2.trim() },
      ]
      await updateRoom(roomId, updatedMembers)
      navigate(`/${roomId}`)
    } catch {
      setSaving(false)
    }
  }

  if (notFound) return <NotFoundPage />

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-background flex items-center justify-center">
        <p className="text-gray-400 text-sm">{MSG.common.loading}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppLogo size="sm" className="mb-4" />
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={() => navigate(`/${roomId}`)}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:text-gray-900"
            aria-label={MSG.common.back}
          >
            <ArrowLeft size={24} />
          </motion.button>
          <h1 className="text-lg font-semibold text-gray-800">{MSG.settings.title}</h1>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">{MSG.settings.member1Label}</label>
            <input
              type="text"
              value={name1}
              onChange={(e) => {
                setName1(e.target.value)
                if (errors.member1) setErrors((prev) => ({ ...prev, member1: validateName(e.target.value) }))
              }}
              maxLength={10}
              className={`w-full border rounded px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.member1 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.member1 && <p className="text-red-500 text-xs mt-1">{errors.member1}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">{MSG.settings.member2Label}</label>
            <input
              type="text"
              value={name2}
              onChange={(e) => {
                setName2(e.target.value)
                if (errors.member2) setErrors((prev) => ({ ...prev, member2: validateName(e.target.value) }))
              }}
              maxLength={10}
              className={`w-full border rounded px-3 py-2 text-base outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.member2 ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.member2 && <p className="text-red-500 text-xs mt-1">{errors.member2}</p>}
          </div>

          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark active:bg-primary-darker disabled:opacity-50"
          >
            {saving ? MSG.common.saving : MSG.settings.saveButton}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
