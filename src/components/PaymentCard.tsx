import { useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import type { Payment } from '../types'

type Props = {
  payment: Payment
  onCompleteRequest: (payment: Payment) => void
  onEditRequest: (payment: Payment) => void
  onDeleteRequest: (payment: Payment) => void
  disabled?: boolean
  fadingOut?: boolean
}

function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

function formatCreatedAt(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${m}/${d}に作成`
}

const SWIPE_THRESHOLD = 80

export function PaymentCard({
  payment,
  onCompleteRequest,
  onEditRequest,
  onDeleteRequest,
  disabled = false,
  fadingOut = false,
}: Props) {
  const hasPayPayUrl = payment.payPayUrl !== null && payment.payPayUrl !== ''
  const [deltaX, setDeltaX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [rightSwipeOpen, setRightSwipeOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const progress = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1)
  const isLeftSwipe = deltaX < 0
  const isRightSwipe = deltaX > 0
  const showCompleteHint = isLeftSwipe && Math.abs(deltaX) > 20
  const showRightHint = isRightSwipe && Math.abs(deltaX) > 20

  const currentTranslateX = rightSwipeOpen ? 160 : isSwiping && isRightSwipe ? deltaX : isSwiping && isLeftSwipe ? deltaX : 0

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (disabled || fadingOut) return
      if (rightSwipeOpen) {
        if (e.dir === 'Left') {
          setRightSwipeOpen(false)
        }
        return
      }
      if (e.dir === 'Left') {
        setIsSwiping(true)
        setDeltaX(e.deltaX)
      } else if (e.dir === 'Right') {
        setIsSwiping(true)
        setDeltaX(e.deltaX)
      }
    },
    onSwipedLeft: (e) => {
      if (disabled || fadingOut) return
      if (rightSwipeOpen) {
        setRightSwipeOpen(false)
        setIsSwiping(false)
        setDeltaX(0)
        return
      }
      setIsSwiping(false)
      setDeltaX(0)
      if (Math.abs(e.deltaX) >= SWIPE_THRESHOLD) {
        onCompleteRequest(payment)
      }
    },
    onSwipedRight: (e) => {
      if (disabled || fadingOut) return
      setIsSwiping(false)
      setDeltaX(0)
      if (Math.abs(e.deltaX) >= SWIPE_THRESHOLD) {
        setRightSwipeOpen(true)
      }
    },
    onSwiped: () => {
      if (disabled || fadingOut) return
      if (!rightSwipeOpen) {
        setIsSwiping(false)
        setDeltaX(0)
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  })

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation()
    setRightSwipeOpen(false)
    onEditRequest(payment)
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation()
    setRightSwipeOpen(false)
    onDeleteRequest(payment)
  }

  function handleOverlayClick() {
    if (rightSwipeOpen) {
      setRightSwipeOpen(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      onClick={handleOverlayClick}
    >
      {/* 左スワイプ（完了）ヒント: 緑 + ✓ */}
      <div
        className="absolute inset-0 rounded-lg flex items-center justify-end pr-6"
        style={{
          backgroundColor: '#4CAF50',
          opacity: showCompleteHint ? progress : 0,
          transition: isSwiping ? 'none' : 'opacity 0.2s ease',
        }}
      >
        <span className="text-white text-3xl font-bold select-none">✓</span>
      </div>

      {/* 右スワイプ（編集・削除）ヒント: 左端から[赤🗑️80px][青✏️80px]で左詰め配置 */}
      <div
        className="absolute inset-y-0 left-0 flex items-center"
        style={{
          width: '160px',
          opacity: showRightHint || rightSwipeOpen ? (rightSwipeOpen ? 1 : progress) : 0,
          transition: isSwiping ? 'none' : 'opacity 0.2s ease',
          pointerEvents: rightSwipeOpen ? 'auto' : 'none',
        }}
      >
        <div
          className="flex items-center justify-center select-none"
          style={{ width: '80px', height: '100%', backgroundColor: '#EF4444' }}
          onClick={rightSwipeOpen ? handleDeleteClick : undefined}
        >
          <span className="text-white text-2xl">🗑️</span>
        </div>
        <div
          className="flex items-center justify-center select-none"
          style={{ width: '80px', height: '100%', backgroundColor: '#3B82F6' }}
          onClick={rightSwipeOpen ? handleEditClick : undefined}
        >
          <span className="text-white text-2xl">✏️</span>
        </div>
      </div>

      <div
        {...handlers}
        className="relative bg-card rounded-lg p-4 shadow-sm"
        style={{
          transform: `translateX(${currentTranslateX}px)`,
          transition: fadingOut
            ? 'opacity 0.4s ease, transform 0.4s ease'
            : isSwiping
            ? 'none'
            : 'transform 0.2s ease',
          opacity: fadingOut ? 0 : 1,
          touchAction: 'pan-y',
        }}
        data-payment-id={payment.id}
      >
        <p className="font-medium text-amount text-base leading-tight">{payment.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{formatCreatedAt(payment.createdAt)}</p>
        <p className="text-3xl font-bold text-amount text-center my-4">
          {formatAmount(payment.amount)}
        </p>
        {hasPayPayUrl ? (
          <a
            href={payment.payPayUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-lg bg-paypay text-white text-center font-bold text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            PayPayで払う
          </a>
        ) : (
          <button
            disabled
            className="block w-full py-3 rounded-lg bg-gray-300 text-gray-400 text-center font-bold text-sm cursor-not-allowed"
          >
            PayPayで払う
          </button>
        )}
      </div>
    </div>
  )
}
