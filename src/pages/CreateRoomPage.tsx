import { AppLogo } from '../components/AppLogo'
import { FormField } from '../components/ui/FormField'
import { MotionButton } from '../components/ui/MotionButton'
import { useCreateRoom } from '../hooks/useCreateRoom'
import { MSG } from '../lib/messages'

export function CreateRoomPage() {
  const { name1, setName1, name2, setName2, errors, creating, networkError, handleCreate } = useCreateRoom()

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <AppLogo size="sm" className="mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">{MSG.createRoom.title}</h1>

        <div className="mb-5">
          <FormField
            label={MSG.createRoom.member1Label}
            value={name1}
            onChange={setName1}
            error={errors.member1}
            maxLength={10}
            placeholder={MSG.createRoom.member1Placeholder}
          />
        </div>

        <div className="mb-8">
          <FormField
            label={MSG.createRoom.member2Label}
            value={name2}
            onChange={setName2}
            error={errors.member2}
            maxLength={10}
            placeholder={MSG.createRoom.member2Placeholder}
          />
        </div>

        {networkError && (
          <p className="text-red-500 text-sm text-center mb-4">{MSG.toast.networkError}</p>
        )}

        <MotionButton
          onClick={handleCreate}
          disabled={creating}
          loading={creating}
          className="w-full py-4 rounded-xl text-base font-bold shadow-md transition-colors"
        >
          {creating ? MSG.createRoom.creating : MSG.createRoom.createButton}
        </MotionButton>
      </div>
    </div>
  )
}
