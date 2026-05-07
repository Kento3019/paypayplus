import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoom, updateRoom } from '../lib/firestore'
import { validateName } from '../lib/validators'
import type { Member } from '../types'

type FormErrors = { member1?: string; member2?: string }
type FormState = 'loading' | 'ready' | 'not_found'

export function useSettingsForm(roomId: string) {
  const navigate = useNavigate()
  const [formState, setFormState] = useState<FormState>('loading')
  const [saving, setSaving] = useState(false)
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [members, setMembers] = useState<[Member, Member] | null>(null)

  useEffect(() => {
    getRoom(roomId).then((room) => {
      if (!room) { setFormState('not_found'); return }
      setMembers(room.members)
      setName1(room.members[0].name)
      setName2(room.members[1].name)
      setFormState('ready')
    })
  }, [roomId])

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

  return { formState, saving, name1, setName1, name2, setName2, errors, setErrors, handleSave }
}
