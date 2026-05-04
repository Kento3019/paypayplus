import { useState } from 'react'
import { CircleCheckBig, ChevronDown } from 'lucide-react'
import type { Payment, Member } from '../types'
import { classifyPayment, formatAmount, formatCompletedDate } from '../lib/dateUtils'

type Props = {
  payments: Payment[]
  members?: [Member, Member] | null
}

type SectionKey = 'thisWeek' | 'thisMonth' | 'earlier'

type SectionConfig = {
  key: SectionKey
  label: string
  defaultOpen: boolean
}

const SECTIONS: SectionConfig[] = [
  { key: 'thisWeek', label: '今週（月曜〜）', defaultOpen: true },
  { key: 'thisMonth', label: '今月（今週除く）', defaultOpen: false },
  { key: 'earlier', label: 'それ以前', defaultOpen: false },
]

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

function CompletedCard({ payment, members }: { payment: Payment; members?: [Member, Member] | null }) {
  const creatorMember = payment.creatorId
    ? members?.find((m) => m.id === payment.creatorId) ?? null
    : null
  const otherMember = payment.creatorId && members
    ? members.find((m) => m.id !== payment.creatorId) ?? null
    : null

  const showUpdatedAt =
    payment.updatedAt !== null &&
    payment.updatedAt !== undefined &&
    !isSameMinute(payment.createdAt, payment.updatedAt)

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border-l-4 border-green-400">
      <div className="p-4 relative">
        {/* 右上: 完了バッジ */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="text-xs text-green-600 font-medium">完了</span>
          <CircleCheckBig size={16} className="text-green-500" />
        </div>

        {/* タイトル */}
        <p className="font-medium text-base leading-tight pr-20 text-gray-800">{payment.title}</p>

        {/* 日時 */}
        <div className="mt-0.5 space-y-0.5">
          <p className="text-xs text-gray-400">作成: {formatDateTime(payment.createdAt)}</p>
          {showUpdatedAt && (
            <p className="text-xs text-gray-400">更新: {formatDateTime(payment.updatedAt!)}</p>
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
              <span className="text-gray-400"> に支払い</span>
            </p>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        )}

        {/* 金額 */}
        <p className="text-3xl font-bold text-gray-700 text-center my-4">
          {formatAmount(payment.amount)}
        </p>

        {/* 完了日時 */}
        {payment.completedAt && (
          <p className="text-xs text-gray-400 text-right mt-2">
            完了: {formatCompletedDate(payment.completedAt)}
          </p>
        )}
      </div>
    </div>
  )
}

function AccordionSection({
  label,
  items,
  isOpen,
  onToggle,
  members,
}: {
  label: string
  items: Payment[]
  isOpen: boolean
  onToggle: () => void
  members?: [Member, Member] | null
}) {
  if (items.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <CircleCheckBig size={14} className="text-green-500" />
          <span className="text-sm font-medium text-gray-600">{label}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="divide-y divide-gray-100">
          {items.map((payment) => (
            <div key={payment.id} className="p-2">
              <CompletedCard payment={payment} members={members} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function HistorySection({ payments, members }: Props) {
  const [openState, setOpenState] = useState<Record<SectionKey, boolean>>({
    thisWeek: true,
    thisMonth: false,
    earlier: false,
  })

  if (payments.length === 0) return null

  const now = new Date()
  const buckets: Record<SectionKey, Payment[]> = {
    thisWeek: [],
    thisMonth: [],
    earlier: [],
  }

  for (const payment of payments) {
    const bucket = classifyPayment(payment, now)
    buckets[bucket].push(payment)
  }

  function toggle(key: SectionKey) {
    setOpenState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="mt-8">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        履歴
      </h2>
      <div className="space-y-2">
        {SECTIONS.map(({ key, label }) => (
          <AccordionSection
            key={key}
            label={label}
            items={buckets[key]}
            isOpen={openState[key]}
            onToggle={() => toggle(key)}
            members={members}
          />
        ))}
      </div>
    </div>
  )
}
