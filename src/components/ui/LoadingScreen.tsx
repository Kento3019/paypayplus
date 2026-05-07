import { MSG } from '../../lib/messages'

type Props = {
  message?: string
}

export function LoadingScreen({ message }: Props) {
  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center">
      <p className="text-gray-400 text-sm">{message ?? MSG.common.loading}</p>
    </div>
  )
}
