import type { Payment } from '../types'

export function getThisWeekMonday(now: Date): Date {
  const monday = new Date(now)
  const day = monday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function getThisMonthStart(now: Date): Date {
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
  return start
}

export type HistoryBucket = 'thisWeek' | 'thisMonth' | 'earlier'

export function classifyPayment(payment: Payment, now: Date): HistoryBucket {
  const completedAt = payment.completedAt
  if (!completedAt) return 'earlier'

  const weekStart = getThisWeekMonday(now)
  const monthStart = getThisMonthStart(now)

  if (completedAt >= weekStart) return 'thisWeek'
  if (completedAt >= monthStart) return 'thisMonth'
  return 'earlier'
}

export function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

export function formatCompletedDate(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${m}/${d}`
}
