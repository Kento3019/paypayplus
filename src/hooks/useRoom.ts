import { useEffect, useState } from 'react'
import { getRoom } from '../lib/firestore'
import type { Member } from '../types'

type RoomState = 'loading' | 'ready' | 'not_found'

export function useRoom(roomId: string) {
  const [members, setMembers] = useState<[Member, Member] | null>(null)
  const [roomState, setRoomState] = useState<RoomState>('loading')

  useEffect(() => {
    getRoom(roomId).then((room) => {
      if (!room) {
        setRoomState('not_found')
        return
      }
      setMembers(room.members)
      setRoomState('ready')
    })
  }, [roomId])

  return { members, roomState }
}
