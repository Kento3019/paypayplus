import { useEffect, useState } from 'react'
import { subscribeActivePayments, subscribeCompletedPayments } from '../lib/firestore'
import type { Payment } from '../types'

export function usePayments(roomId: string) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [completedPayments, setCompletedPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubActive = subscribeActivePayments(roomId, (data) => {
      setPayments(data)
      setLoading(false)
    })
    const unsubCompleted = subscribeCompletedPayments(roomId, (data) => {
      setCompletedPayments(data)
    })
    return () => {
      unsubActive()
      unsubCompleted()
    }
  }, [roomId])

  return { payments, completedPayments, loading }
}
