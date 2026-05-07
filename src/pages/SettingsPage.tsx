import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppLogo } from '../components/AppLogo'
import { FormField } from '../components/ui/FormField'
import { MotionButton } from '../components/ui/MotionButton'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { useSettingsForm } from '../hooks/useSettingsForm'
import { NotFoundPage } from './NotFoundPage'
import { MSG } from '../lib/messages'

export function SettingsPage() {
  const { roomId = '' } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { formState, saving, name1, setName1, name2, setName2, errors, handleSave } = useSettingsForm(roomId)

  if (formState === 'not_found') return <NotFoundPage />
  if (formState === 'loading') return <LoadingScreen />

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        <AppLogo size="sm" className="mb-4" />
        <div className="flex items-center gap-3 mb-6">
          <MotionButton
            onClick={() => navigate(`/${roomId}`)}
            variant="ghost"
            aria-label={MSG.common.back}
          >
            <ArrowLeft size={24} />
          </MotionButton>
          <h1 className="text-lg font-semibold text-gray-800">{MSG.settings.title}</h1>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          <FormField
            label={MSG.settings.member1Label}
            value={name1}
            onChange={setName1}
            error={errors.member1}
            maxLength={10}
          />
          <FormField
            label={MSG.settings.member2Label}
            value={name2}
            onChange={setName2}
            error={errors.member2}
            maxLength={10}
          />
          <MotionButton
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            className="w-full py-3 rounded-lg font-medium"
          >
            {saving ? MSG.common.saving : MSG.settings.saveButton}
          </MotionButton>
        </div>
      </div>
    </div>
  )
}
