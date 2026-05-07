import type { Payment, Member } from '../../types'
import { PaymentCard } from '../PaymentCard'
import { EditCard } from '../EditCard'

type SaveData = { title: string; amount: number; payPayUrl: string | null; creatorId: string | null }

type Props = {
  payments: Payment[]
  members: [Member, Member] | null
  editingId: string | null
  isAdding: boolean
  isLocked: boolean
  fadingOutIds: Set<string>
  onCompleteRequest: (payment: Payment) => void
  onEditRequest: (payment: Payment) => void
  onDeleteRequest: (payment: Payment) => void
  onSaveAdd: (data: SaveData) => Promise<void>
  onCancelAdd: () => void
  onSaveEdit: (paymentId: string, data: SaveData) => Promise<void>
  onCancelEdit: () => void
}

export function PaymentList({
  payments, members, editingId, isAdding, isLocked, fadingOutIds,
  onCompleteRequest, onEditRequest, onDeleteRequest,
  onSaveAdd, onCancelAdd, onSaveEdit, onCancelEdit,
}: Props) {
  return (
    <ul className="space-y-3">
      {isAdding && (
        <li>
          <EditCard onSave={onSaveAdd} onCancel={onCancelAdd} members={members} isNew />
        </li>
      )}
      {payments.map((payment, index) => (
        <li
          key={payment.id}
          className={isLocked && editingId !== payment.id ? 'pointer-events-none opacity-60' : ''}
        >
          {editingId === payment.id ? (
            <EditCard
              initialData={{
                title: payment.title,
                amount: payment.amount,
                payPayUrl: payment.payPayUrl,
                creatorId: payment.creatorId,
              }}
              onSave={(data) => onSaveEdit(payment.id, data)}
              onCancel={onCancelEdit}
              members={members}
              isNew={false}
            />
          ) : (
            <PaymentCard
              payment={payment}
              members={members}
              onCompleteRequest={onCompleteRequest}
              onEditRequest={onEditRequest}
              onDeleteRequest={onDeleteRequest}
              disabled={isLocked}
              fadingOut={fadingOutIds.has(payment.id)}
              index={index}
            />
          )}
        </li>
      ))}
    </ul>
  )
}
