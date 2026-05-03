import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Settings } from 'lucide-react'
import { subscribeActivePayments, subscribeCompletedPayments, createPayment, updatePayment, deletePayment, getRoom } from '../lib/firestore'
import type { Payment, Member } from '../types'
import { PaymentCard } from '../components/PaymentCard'
import { EditCard } from '../components/EditCard'
import { Toast, createToast } from '../components/Toast'
import type { ToastMessage } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { HistorySection } from '../components/HistorySection'
import { navigateToHash } from '../lib/routing'

type Props = {
  roomId: string
  onNotFound?: () => void
}

export function RoomPage({ roomId, onNotFound }: Props) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [completedPayments, setCompletedPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<[Member, Member] | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [pendingCompletePayment, setPendingCompletePayment] = useState<Payment | null>(null)
  const [pendingDeletePayment, setPendingDeletePayment] = useState<Payment | null>(null)
  const [fadingOutIds, setFadingOutIds] = useState<Set<string>>(new Set())
  const initialLoadDone = useRef(false)

  useEffect(() => {
    getRoom(roomId).then((room) => {
      if (!room) {
        onNotFound?.()
        return
      }
      setMembers(room.members)
    })
  }, [roomId, onNotFound])

  useEffect(() => {
    const unsubscribeActive = subscribeActivePayments(roomId, (data) => {
      setPayments(data)
      setLoading(false)

      if (!initialLoadDone.current) {
        initialLoadDone.current = true
        if (data.length === 0) {
          setIsAdding(true)
        }
      } else if (data.length === 0) {
        setIsAdding(true)
      }
    })
    const unsubscribeCompleted = subscribeCompletedPayments(roomId, (data) => {
      setCompletedPayments(data)
    })
    return () => {
      unsubscribeActive()
      unsubscribeCompleted()
    }
  }, [roomId])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  function showToast(message: string, type: 'success' | 'error' | 'complete' | 'delete' = 'success') {
    setToasts((prev) => [...prev, createToast(message, type)])
  }

  function handleFabClick() {
    if (isAdding || editingId !== null) return
    setIsAdding(true)
  }

  function handleCancelAdd() {
    setIsAdding(false)
  }

  async function handleSaveAdd(data: { title: string; amount: number; payPayUrl: string | null; creatorId: string | null }) {
    if (!navigator.onLine) {
      showToast('通信エラーが発生しました', 'error')
      return
    }
    try {
      await createPayment(roomId, {
        title: data.title,
        amount: data.amount,
        payPayUrl: data.payPayUrl,
        createdAt: new Date(),
        completedAt: null,
        isDone: false,
        creatorId: data.creatorId,
      })
      setIsAdding(false)
      showToast('保存しました', 'success')
    } catch {
      showToast('通信エラーが発生しました', 'error')
    }
  }

  function handleOverlayClick() {
    if (isAdding) {
      setIsAdding(false)
    }
    if (editingId !== null) {
      setEditingId(null)
    }
  }

  function handleCompleteRequest(payment: Payment) {
    setPendingCompletePayment(payment)
  }

  async function handleConfirmComplete() {
    if (!navigator.onLine) {
      showToast('通信エラーが発生しました', 'error')
      return
    }
    if (!pendingCompletePayment) return
    const target = pendingCompletePayment
    setPendingCompletePayment(null)

    setFadingOutIds((prev) => new Set(prev).add(target.id))

    setTimeout(async () => {
      try {
        await updatePayment(roomId, target.id, {
          isDone: true,
          completedAt: new Date(),
        })
        showToast('完了しました 🎉', 'complete')
      } catch {
        setFadingOutIds((prev) => {
          const next = new Set(prev)
          next.delete(target.id)
          return next
        })
        showToast('通信エラーが発生しました', 'error')
      }
    }, 350)
  }

  function handleCancelComplete() {
    setPendingCompletePayment(null)
  }

  function handleEditRequest(payment: Payment) {
    setEditingId(payment.id)
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  async function handleSaveEdit(
    paymentId: string,
    data: { title: string; amount: number; payPayUrl: string | null; creatorId: string | null }
  ) {
    if (!navigator.onLine) {
      showToast('通信エラーが発生しました', 'error')
      return
    }
    try {
      await updatePayment(roomId, paymentId, {
        title: data.title,
        amount: data.amount,
        payPayUrl: data.payPayUrl,
        creatorId: data.creatorId,
      })
      setEditingId(null)
      showToast('保存しました', 'success')
    } catch {
      showToast('通信エラーが発生しました', 'error')
    }
  }

  function handleDeleteRequest(payment: Payment) {
    setPendingDeletePayment(payment)
  }

  async function handleConfirmDelete() {
    if (!navigator.onLine) {
      showToast('通信エラーが発生しました', 'error')
      return
    }
    if (!pendingDeletePayment) return
    const target = pendingDeletePayment
    setPendingDeletePayment(null)

    setFadingOutIds((prev) => new Set(prev).add(target.id))

    setTimeout(async () => {
      try {
        await deletePayment(roomId, target.id)
        showToast('削除しました', 'delete')
      } catch {
        setFadingOutIds((prev) => {
          const next = new Set(prev)
          next.delete(target.id)
          return next
        })
        showToast('通信エラーが発生しました', 'error')
      }
    }, 350)
  }

  function handleCancelDelete() {
    setPendingDeletePayment(null)
  }

  const isLocked = isAdding || editingId !== null

  return (
    <div className="min-h-screen bg-background" onClick={handleOverlayClick}>
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-end mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation()
              navigateToHash(`settings/${roomId}`)
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="設定"
          >
            <Settings size={22} />
          </motion.button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-400 text-sm">読み込み中...</p>
          </div>
        ) : (
          <>
            {isAdding || payments.length > 0 ? (
              <ul className="space-y-3">
                {isAdding && (
                  <li>
                    <EditCard
                      onSave={handleSaveAdd}
                      onCancel={handleCancelAdd}
                      members={members}
                      isNew={true}
                    />
                  </li>
                )}
                {payments.map((payment, index) => (
                  <li
                    key={payment.id}
                    className={
                      isLocked && editingId !== payment.id
                        ? 'pointer-events-none opacity-60'
                        : ''
                    }
                  >
                    {editingId === payment.id ? (
                      <EditCard
                        initialData={{
                          title: payment.title,
                          amount: payment.amount,
                          payPayUrl: payment.payPayUrl,
                          creatorId: payment.creatorId,
                        }}
                        onSave={(data) => handleSaveEdit(payment.id, data)}
                        onCancel={handleCancelEdit}
                        members={members}
                        isNew={false}
                      />
                    ) : (
                      <PaymentCard
                        payment={payment}
                        members={members}
                        onCompleteRequest={handleCompleteRequest}
                        onEditRequest={handleEditRequest}
                        onDeleteRequest={handleDeleteRequest}
                        disabled={isLocked}
                        fadingOut={fadingOutIds.has(payment.id)}
                        index={index}
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : null}

            <HistorySection payments={completedPayments} />
          </>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          handleFabClick()
        }}
        disabled={isAdding || editingId !== null || loading}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white text-3xl shadow-lg flex items-center justify-center transition-opacity ${
          isAdding || editingId !== null || loading
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:bg-blue-600 active:bg-blue-700'
        }`}
        aria-label="支払いを追加"
      >
        <Plus size={28} />
      </motion.button>

      <Toast toasts={toasts} onDismiss={dismissToast} />

      {pendingCompletePayment && (
        <ConfirmDialog
          message="支払い完了しましたか？"
          onConfirm={handleConfirmComplete}
          onCancel={handleCancelComplete}
        />
      )}

      {pendingDeletePayment && (
        <ConfirmDialog
          message="削除しますか？"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  )
}
