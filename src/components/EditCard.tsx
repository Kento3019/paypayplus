import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardPaste } from 'lucide-react'
import type { Member } from '../types'
import { MSG } from '../lib/messages'

type FormErrors = {
  title?: string
  amount?: string
  payPayUrl?: string
}

type InitialData = {
  title: string
  amount: number
  payPayUrl: string | null
  creatorId?: string | null
}

type Props = {
  onSave: (data: { title: string; amount: number; payPayUrl: string | null; creatorId: string | null }) => Promise<void>
  onCancel: () => void
  initialData?: InitialData
  members?: [Member, Member] | null
  isNew?: boolean
}

function validateTitle(value: string): string | undefined {
  if (value.trim() === '') return MSG.validation.titleRequired
  if (value.length > 20) return MSG.validation.titleMaxLength
  return undefined
}

function validateAmount(value: string): string | undefined {
  if (value === '') return MSG.validation.amountRequired
  if (!/^\d+$/.test(value)) return MSG.validation.amountNumericOnly
  const num = parseInt(value, 10)
  if (num < 1) return MSG.validation.amountMin
  if (num >= 1000000) return MSG.validation.amountMax
  return undefined
}

function validatePayPayUrl(value: string): string | undefined {
  if (value === '') return undefined
  try {
    const url = new URL(value)
    if (!url.hostname.endsWith('paypay.ne.jp')) {
      return MSG.validation.payPayUrlDomain
    }
  } catch {
    return MSG.validation.payPayUrlInvalid
  }
  return undefined
}

export function EditCard({ onSave, onCancel, initialData, members, isNew = false }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [amount, setAmount] = useState(initialData?.amount != null ? String(initialData.amount) : '')
  const [payPayUrl, setPayPayUrl] = useState(initialData?.payPayUrl ?? '')
  const [creatorId, setCreatorId] = useState<string | null>(initialData?.creatorId ?? null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  async function handleSave() {
    const titleError = validateTitle(title)
    const amountError = validateAmount(amount)
    const payPayUrlError = validatePayPayUrl(payPayUrl)

    const newErrors: FormErrors = {}
    if (titleError) newErrors.title = titleError
    if (amountError) newErrors.amount = amountError
    if (payPayUrlError) newErrors.payPayUrl = payPayUrlError

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        amount: parseInt(amount, 10),
        payPayUrl: payPayUrl.trim() !== '' ? payPayUrl.trim() : null,
        creatorId,
      })
    } finally {
      setSaving(false)
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      setPayPayUrl(text)
      if (errors.payPayUrl) {
        setErrors((prev) => ({ ...prev, payPayUrl: undefined }))
      }
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  function handlePayPayUrlChange(value: string) {
    setPayPayUrl(value)
    if (errors.payPayUrl) {
      const err = validatePayPayUrl(value)
      setErrors((prev) => ({ ...prev, payPayUrl: err }))
    }
  }

  function handleCreatorToggle(memberId: string) {
    setCreatorId((prev) => (prev === memberId ? null : memberId))
  }

  return (
    <motion.div
      ref={cardRef}
      initial={isNew ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-card rounded-lg p-4 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: validateTitle(e.target.value) }))
            }
          }}
          maxLength={20}
          placeholder={MSG.editCard.titlePlaceholder}
          autoFocus
          className={`w-full border rounded px-3 py-2 text-base outline-none focus:ring-2 focus:ring-blue-400 ${errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-3">
        <div className={`flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 ${errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}>
          <span className="text-gray-500 mr-1">¥</span>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, '')
              setAmount(v)
              if (errors.amount) {
                setErrors((prev) => ({ ...prev, amount: validateAmount(v) }))
              }
            }}
            placeholder="0"
            className="flex-1 outline-none text-base bg-transparent"
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>

      <div className="mb-4">
        <div className={`flex items-center border rounded focus-within:ring-2 focus-within:ring-blue-400 ${errors.payPayUrl ? 'border-red-500' : 'border-gray-300'
          }`}>
          <input
            type="url"
            value={payPayUrl}
            onChange={(e) => handlePayPayUrlChange(e.target.value)}
            placeholder="https://paypay.ne.jp/..."
            className="flex-1 px-3 py-2 outline-none text-sm bg-transparent min-w-0"
          />
          <motion.button
            type="button"
            onClick={handlePaste}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 border-l border-gray-300 text-gray-500 hover:bg-gray-50 shrink-0 flex items-center justify-center"
            title={MSG.editCard.pasteTip}
          >
            <ClipboardPaste size={20} />
          </motion.button>
        </div>
        {errors.payPayUrl && (
          <p className="text-red-500 text-xs mt-1">{errors.payPayUrl}</p>
        )}
      </div>

      {members && (
        <div className="mb-4 flex flex-col gap-2">
          <motion.button
            type="button"
            onClick={() => handleCreatorToggle(members[0].id)}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 rounded-lg text-sm font-medium border transition-colors whitespace-normal text-center"
            style={
              creatorId === members[0].id
                ? { backgroundColor: members[1].color, borderColor: members[1].color, color: '#fff' }
                : { backgroundColor: '#fff', borderColor: '#d1d5db', color: '#374151' }
            }
          >
            {MSG.editCard.payDirectionFn(members[1].name, members[0].name)}
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleCreatorToggle(members[1].id)}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 rounded-lg text-sm font-medium border transition-colors whitespace-normal text-center"
            style={
              creatorId === members[1].id
                ? { backgroundColor: members[0].color, borderColor: members[0].color, color: '#fff' }
                : { backgroundColor: '#fff', borderColor: '#d1d5db', color: '#374151' }
            }
          >
            {MSG.editCard.payDirectionFn(members[0].name, members[1].name)}
          </motion.button>
        </div>
      )}

      <div className="flex gap-2">
        <motion.button
          type="button"
          onClick={onCancel}
          disabled={saving}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {MSG.common.cancel}
        </motion.button>
        <motion.button
          type="button"
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {saving ? MSG.common.saving : MSG.common.save}
        </motion.button>
      </div>
    </motion.div>
  )
}
