import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom } from '../lib/firestore'
import { generateRandomHash } from '../lib/routing'
import { validateName } from '../lib/validators'
import type { Member } from '../types'

type FormErrors = { member1?: string; member2?: string }

export function useCreateRoom() {
  const navigate = useNavigate()
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [creating, setCreating] = useState(false)
  const [networkError, setNetworkError] = useState(false)

  async function handleCreate() {
    const e1 = validateName(name1)
    const e2 = validateName(name2)
    setErrors({ member1: e1, member2: e2 })
    if (e1 || e2) return

    setCreating(true)
    setNetworkError(false)
    try {
      const roomId = generateRandomHash()
      const members: [Member, Member] = [
        { id: 'm1', name: name1.trim(), color: '#2196F3' },
        { id: 'm2', name: name2.trim(), color: '#F44336' },
      ]
      await createRoom(roomId, members)
      navigate(`/share/${roomId}`)
    } catch {
      setCreating(false)
      setNetworkError(true)
    }
  }

  return { name1, setName1, name2, setName2, errors, creating, networkError, handleCreate }
}
