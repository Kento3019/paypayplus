import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Payment } from '../types'

const paymentsRef = (roomId: string) =>
  collection(db, 'rooms', roomId, 'payments')

export async function createPayment(
  roomId: string,
  data: Omit<Payment, 'id'>
): Promise<string> {
  const ref = await addDoc(paymentsRef(roomId), {
    title: data.title,
    amount: data.amount,
    payPayUrl: data.payPayUrl,
    createdAt: Timestamp.fromDate(data.createdAt),
    completedAt: data.completedAt ? Timestamp.fromDate(data.completedAt) : null,
    isDone: data.isDone,
  })
  console.log('[Firestore] created payment', ref.id, 'in room', roomId)
  return ref.id
}

export async function updatePayment(
  roomId: string,
  paymentId: string,
  data: Partial<Omit<Payment, 'id'>>
): Promise<void> {
  const ref = doc(db, 'rooms', roomId, 'payments', paymentId)
  const update: Record<string, unknown> = { ...data }
  if (data.createdAt) update.createdAt = Timestamp.fromDate(data.createdAt)
  if (data.completedAt) update.completedAt = Timestamp.fromDate(data.completedAt)
  await updateDoc(ref, update)
  console.log('[Firestore] updated payment', paymentId)
}

export async function deletePayment(
  roomId: string,
  paymentId: string
): Promise<void> {
  const ref = doc(db, 'rooms', roomId, 'payments', paymentId)
  await deleteDoc(ref)
  console.log('[Firestore] deleted payment', paymentId)
}

export async function listPayments(roomId: string): Promise<Payment[]> {
  const snap = await getDocs(paymentsRef(roomId))
  const payments = snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      title: data.title as string,
      amount: data.amount as number,
      payPayUrl: data.payPayUrl as string | null,
      createdAt: (data.createdAt as Timestamp).toDate(),
      completedAt: data.completedAt
        ? (data.completedAt as Timestamp).toDate()
        : null,
      isDone: data.isDone as boolean,
    } satisfies Payment
  })
  console.log('[Firestore] listPayments for room', roomId, ':', payments.length, 'docs')
  return payments
}

function docToPayment(d: { id: string; data: () => Record<string, unknown> }): Payment {
  const data = d.data()
  return {
    id: d.id,
    title: data.title as string,
    amount: data.amount as number,
    payPayUrl: data.payPayUrl as string | null,
    createdAt: (data.createdAt as Timestamp).toDate(),
    completedAt: data.completedAt
      ? (data.completedAt as Timestamp).toDate()
      : null,
    isDone: data.isDone as boolean,
  }
}

export function subscribeActivePayments(
  roomId: string,
  callback: (payments: Payment[]) => void
): () => void {
  const q = query(
    paymentsRef(roomId),
    where('isDone', '==', false),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const payments = snap.docs.map(docToPayment)
    callback(payments)
  })
}

export function subscribeCompletedPayments(
  roomId: string,
  callback: (payments: Payment[]) => void
): () => void {
  const q = query(
    paymentsRef(roomId),
    where('isDone', '==', true)
  )
  return onSnapshot(q, (snap) => {
    const payments = snap.docs.map(docToPayment).sort((a, b) => {
      const aTime = a.completedAt ? a.completedAt.getTime() : 0
      const bTime = b.completedAt ? b.completedAt.getTime() : 0
      return bTime - aTime
    })
    callback(payments)
  })
}
