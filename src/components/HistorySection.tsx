import { useState } from 'react'
import type { Payment } from '../types'
import { classifyPayment, formatAmount, formatCompletedDate } from '../lib/dateUtils'

type Props = {
  payments: Payment[]
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

function AccordionSection({
  label,
  items,
  isOpen,
  onToggle,
}: {
  label: string
  items: Payment[]
  isOpen: boolean
  onToggle: () => void
}) {
  if (items.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left"
        onClick={onToggle}
      >
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-gray-400 text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <ul className="divide-y divide-gray-100">
          {items.map((payment) => (
            <li key={payment.id} className="px-4 py-2 text-sm text-done">
              {payment.title} {formatAmount(payment.amount)}{' '}
              ({payment.completedAt ? formatCompletedDate(payment.completedAt) : ''})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function HistorySection({ payments }: Props) {
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
          />
        ))}
      </div>
    </div>
  )
}
