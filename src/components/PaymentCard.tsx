import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'
import { CircleCheckBig, SquarePen, Trash2, AlertCircle } from 'lucide-react'
import type { Payment, Member } from '../types'
import { MSG } from '../lib/messages'

type Props = {
  payment: Payment
  members?: [Member, Member] | null
  onCompleteRequest: (payment: Payment) => void
  onEditRequest: (payment: Payment) => void
  onDeleteRequest: (payment: Payment) => void
  disabled?: boolean
  fadingOut?: boolean
  index?: number
}

function formatAmount(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

function formatDateTime(date: Date): string {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${m}/${d} ${hh}:${mm}`
}

function isSameMinute(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate() &&
    a.getHours() === b.getHours() &&
    a.getMinutes() === b.getMinutes()
  )
}

const SWIPE_THRESHOLD = 80

export function PaymentCard({
  payment,
  members,
  onCompleteRequest,
  onEditRequest,
  onDeleteRequest,
  disabled = false,
  fadingOut = false,
  index = 0,
}: Props) {
  const hasPayPayUrl = payment.payPayUrl !== null && payment.payPayUrl !== ''

  const creatorMember = payment.creatorId
    ? members?.find((m) => m.id === payment.creatorId) ?? null
    : null
  const otherMember = payment.creatorId && members
    ? members.find((m) => m.id !== payment.creatorId) ?? null
    : null
  const borderColor = creatorMember ? creatorMember.color : '#E0E0E0'

  const showUpdatedAt =
    payment.updatedAt !== null &&
    payment.updatedAt !== undefined &&
    !isSameMinute(payment.createdAt, payment.updatedAt)

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
    preventScrollOnSwipe: false,
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={
        fadingOut
          ? { opacity: 0, x: 120 }
          : { opacity: 1, y: 0, x: 0 }
      }
      transition={
        fadingOut
          ? { duration: 0.3, ease: 'easeIn' }
          : { duration: 0.3, delay: index * 0.05, ease: 'easeOut' }
      }
      ref={containerRef}
      className="relative overflow-hidden rounded-lg"
      onClick={handleOverlayClick}
    >
      {/* 左スワイプ（完了）ヒント */}
      <div
        className="absolute inset-0 rounded-lg flex items-center justify-end pr-6"
        style={{
          backgroundColor: '#4CAF50',
          opacity: showCompleteHint ? progress : 0,
          transition: isSwiping ? 'none' : 'opacity 0.2s ease',
        }}
      >
        <CircleCheckBig size={32} className="text-white" />
      </div>

      {/* 右スワイプ（編集・削除）ヒント */}
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
          className="flex items-center justify-center select-none gap-1 flex-col"
          style={{ width: '80px', height: '100%', backgroundColor: '#EF4444' }}
          onClick={rightSwipeOpen ? handleDeleteClick : undefined}
        >
          <Trash2 size={20} className="text-white" />
          <span className="text-white text-xs">{MSG.paymentCard.delete}</span>
        </div>
        <div
          className="flex items-center justify-center select-none gap-1 flex-col"
          style={{ width: '80px', height: '100%', backgroundColor: '#3B82F6' }}
          onClick={rightSwipeOpen ? handleEditClick : undefined}
        >
          <SquarePen size={20} className="text-white" />
          <span className="text-white text-xs">{MSG.paymentCard.edit}</span>
        </div>
      </div>

      <div
        {...handlers}
        className="relative bg-card rounded-lg shadow-sm overflow-hidden"
        style={{
          transform: `translateX(${currentTranslateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease',
          touchAction: 'pan-y',
        }}
        data-payment-id={payment.id}
      >
        <div className="flex">
          <div
            className="shrink-0 rounded-l-lg"
            style={{ width: '4px', backgroundColor: borderColor }}
          />
          <div className="flex-1 p-4 relative min-w-0">
            {/* 未完了バッジ */}
            <div className="absolute top-2 right-2">
              <AlertCircle size={18} className="text-red-500" />
            </div>

            <p className="font-medium text-amount text-base leading-tight pr-6 line-clamp-2">{payment.title}</p>

            {/* 日時表示 */}
            <div className="mt-0.5 space-y-0.5">
              <p className="text-xs text-gray-400">{MSG.paymentCard.createdAtFn(formatDateTime(payment.createdAt))}</p>
              {showUpdatedAt && (
                <p className="text-xs text-gray-400">{MSG.paymentCard.updatedAtFn(formatDateTime(payment.updatedAt!))}</p>
              )}
            </div>

            {/* 支払い方向セパレーター */}
            {creatorMember && otherMember && (
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-gray-200" />
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  <span style={{ color: creatorMember.color }}>{creatorMember.name}</span>
                  <span className="text-gray-400 mx-1">→</span>
                  <span style={{ color: otherMember.color }}>{otherMember.name}</span>
                  <span className="text-gray-400">{MSG.paymentCard.payDirectionSuffix}</span>
                </p>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            <p className="text-3xl font-bold text-amount text-center my-4">
              {formatAmount(payment.amount)}
            </p>
            {hasPayPayUrl ? (
              <motion.a
                href={payment.payPayUrl!}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                className="block w-full py-3 rounded-lg bg-paypay text-white text-center font-bold text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {MSG.paymentCard.payPayButton}
              </motion.a>
            ) : (
              <button
                disabled
                className="block w-full py-3 rounded-lg bg-gray-300 text-gray-400 text-center font-bold text-sm cursor-not-allowed"
              >
                {MSG.paymentCard.payPayButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
