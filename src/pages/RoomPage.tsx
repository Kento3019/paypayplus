import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { subscribeActivePayments, subscribeCompletedPayments, createPayment, updatePayment, deletePayment } from '../lib/firestore'
import type { Payment } from '../types'
import { PaymentCard } from '../components/PaymentCard'
import { EditCard } from '../components/EditCard'
import { Toast, createToast } from '../components/Toast'
import type { ToastMessage } from '../components/Toast'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { HistorySection } from '../components/HistorySection'

type Props = {
  roomId: string
}

export function RoomPage({ roomId }: Props) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [completedPayments, setCompletedPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [pendingCompletePayment, setPendingCompletePayment] = useState<Payment | null>(null)
  const [pendingDeletePayment, setPendingDeletePayment] = useState<Payment | null>(null)
  const [fadingOutIds, setFadingOutIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const unsubscribeActive = subscribeActivePayments(roomId, (data) => {
      setPayments(data)
      setLoading(false)
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

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToasts((prev) => [...prev, createToast(message, type)])
  }

  function handleFabClick() {
    if (isAdding || editingId !== null) return
    setIsAdding(true)
  }

  function handleCancelAdd() {
    setIsAdding(false)
  }

  async function handleSaveAdd(data: { title: string; amount: number; payPayUrl: string | null }) {
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
      })
      setIsAdding(false)
      showToast('保存しました')
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
        showToast('完了しました')
      } catch {
        setFadingOutIds((prev) => {
          const next = new Set(prev)
          next.delete(target.id)
          return next
        })
        showToast('通信エラーが発生しました', 'error')
      }
    }, 400)
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
    data: { title: string; amount: number; payPayUrl: string | null }
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
      })
      setEditingId(null)
      showToast('保存しました')
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
        showToast('削除しました')
      } catch {
        setFadingOutIds((prev) => {
          const next = new Set(prev)
          next.delete(target.id)
          return next
        })
        showToast('通信エラーが発生しました', 'error')
      }
    }, 400)
  }

  function handleCancelDelete() {
    setPendingDeletePayment(null)
  }

  const isLocked = isAdding || editingId !== null

  return (
    <div className="min-h-screen bg-background" onClick={handleOverlayClick}>
      <div className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen -mt-6">
            <p className="text-gray-400 text-sm">読み込み中...</p>
          </div>
        ) : (
          <>
            {isAdding || payments.length > 0 ? (
              <ul className="space-y-3">
                {isAdding && (
                  <li>
                    <EditCard onSave={handleSaveAdd} onCancel={handleCancelAdd} />
                  </li>
                )}
                {payments.map((payment) => (
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
                        }}
                        onSave={(data) => handleSaveEdit(payment.id, data)}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <PaymentCard
                        payment={payment}
                        onCompleteRequest={handleCompleteRequest}
                        onEditRequest={handleEditRequest}
                        onDeleteRequest={handleDeleteRequest}
                        disabled={isLocked}
                        fadingOut={fadingOutIds.has(payment.id)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center min-h-screen -mt-6">
                <p className="text-gray-400 text-sm">URLを共有してね</p>
              </div>
            )}

            <HistorySection payments={completedPayments} />
          </>
        )}
      </div>

      <button
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
      </button>

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
