import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { createPayment, updatePayment, deletePayment } from '../lib/firestore'
import type { Payment } from '../types'
import { Banner } from '../components/Banner'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { HistorySection } from '../components/HistorySection'
import { RoomHeader } from '../components/room/RoomHeader'
import { EmptyState } from '../components/room/EmptyState'
import { PaymentList } from '../components/room/PaymentList'
import { useRoom } from '../hooks/useRoom'
import { usePayments } from '../hooks/usePayments'
import { useBanner } from '../hooks/useBanner'
import { NotFoundPage } from './NotFoundPage'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { MSG } from '../lib/messages'

export function RoomPage() {
  const { roomId = '' } = useParams<{ roomId: string }>()
  const { members, roomState } = useRoom(roomId)
  const { payments, completedPayments, loading } = usePayments(roomId)
  const { banners, showBanner, dismissBanner } = useBanner()

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pendingCompletePayment, setPendingCompletePayment] = useState<Payment | null>(null)
  const [pendingDeletePayment, setPendingDeletePayment] = useState<Payment | null>(null)
  const [fadingOutIds, setFadingOutIds] = useState<Set<string>>(new Set())

  const isLocked = isAdding || editingId !== null

  function handleOverlayClick() {
    if (isAdding) setIsAdding(false)
    if (editingId !== null) setEditingId(null)
  }

  async function handleSaveAdd(data: { title: string; amount: number; payPayUrl: string | null; creatorId: string | null }) {
    if (!navigator.onLine) { showBanner(MSG.toast.networkError, 'error'); return }
    try {
      await createPayment(roomId, {
        title: data.title, amount: data.amount, payPayUrl: data.payPayUrl,
        createdAt: new Date(), updatedAt: null, completedAt: null,
        isDone: false, creatorId: data.creatorId,
      })
      setIsAdding(false)
      showBanner(MSG.toast.saved, 'save')
    } catch {
      showBanner(MSG.toast.networkError, 'error')
    }
  }

  async function handleSaveEdit(paymentId: string, data: { title: string; amount: number; payPayUrl: string | null; creatorId: string | null }) {
    if (!navigator.onLine) { showBanner(MSG.toast.networkError, 'error'); return }
    try {
      await updatePayment(roomId, paymentId, { title: data.title, amount: data.amount, payPayUrl: data.payPayUrl, creatorId: data.creatorId })
      setEditingId(null)
      showBanner(MSG.toast.saved, 'save')
    } catch {
      showBanner(MSG.toast.networkError, 'error')
    }
  }

  async function handleConfirmComplete() {
    if (!navigator.onLine) { showBanner(MSG.toast.networkError, 'error'); return }
    if (!pendingCompletePayment) return
    const target = pendingCompletePayment
    setPendingCompletePayment(null)
    setFadingOutIds((prev) => new Set(prev).add(target.id))
    setTimeout(async () => {
      try {
        await updatePayment(roomId, target.id, { isDone: true, completedAt: new Date() })
        showBanner(MSG.toast.completed, 'complete')
      } catch {
        setFadingOutIds((prev) => { const next = new Set(prev); next.delete(target.id); return next })
        showBanner(MSG.toast.networkError, 'error')
      }
    }, 350)
  }

  async function handleConfirmDelete() {
    if (!navigator.onLine) { showBanner(MSG.toast.networkError, 'error'); return }
    if (!pendingDeletePayment) return
    const target = pendingDeletePayment
    setPendingDeletePayment(null)
    setFadingOutIds((prev) => new Set(prev).add(target.id))
    setTimeout(async () => {
      try {
        await deletePayment(roomId, target.id)
        showBanner(MSG.toast.deleted, 'delete')
      } catch {
        setFadingOutIds((prev) => { const next = new Set(prev); next.delete(target.id); return next })
        showBanner(MSG.toast.networkError, 'error')
      }
    }, 350)
  }

  if (roomState === 'not_found') return <NotFoundPage />

  return (
    <div className="min-h-[100dvh] bg-background" onClick={handleOverlayClick}>
      <div className="max-w-md mx-auto px-4 py-6">
        <RoomHeader roomId={roomId} />

        {loading ? (
          <LoadingScreen />
        ) : isAdding || payments.length > 0 ? (
          <PaymentList
            payments={payments}
            members={members}
            editingId={editingId}
            isAdding={isAdding}
            isLocked={isLocked}
            fadingOutIds={fadingOutIds}
            onCompleteRequest={setPendingCompletePayment}
            onEditRequest={(p) => setEditingId(p.id)}
            onDeleteRequest={setPendingDeletePayment}
            onSaveAdd={handleSaveAdd}
            onCancelAdd={() => setIsAdding(false)}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setEditingId(null)}
          />
        ) : (
          <EmptyState />
        )}

        <HistorySection payments={completedPayments} members={members} />
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={(e) => { e.stopPropagation(); if (!isLocked && !loading) setIsAdding(true) }}
        disabled={isLocked || loading}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white text-3xl shadow-lg flex items-center justify-center transition-opacity ${
          isLocked || loading ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-dark active:bg-primary-darker'
        }`}
        aria-label={MSG.room.fabLabel}
      >
        <Plus size={28} />
      </motion.button>

      <Banner banners={banners} onDismiss={dismissBanner} />

      {pendingCompletePayment && (
        <ConfirmDialog message={MSG.dialog.completeConfirm} onConfirm={handleConfirmComplete} onCancel={() => setPendingCompletePayment(null)} />
      )}
      {pendingDeletePayment && (
        <ConfirmDialog message={MSG.dialog.deleteConfirm} onConfirm={handleConfirmDelete} onCancel={() => setPendingDeletePayment(null)} />
      )}
    </div>
  )
}
