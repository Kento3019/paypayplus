import { useCallback, useState } from 'react'
import { createBanner } from '../components/Banner'
import type { BannerMessage, BannerType } from '../components/Banner'

export function useBanner() {
  const [banners, setBanners] = useState<BannerMessage[]>([])

  const showBanner = useCallback((message: string, type: BannerType = 'save') => {
    setBanners((prev) => [...prev, createBanner(message, type)])
  }, [])

  const dismissBanner = useCallback((id: number) => {
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }, [])

  return { banners, showBanner, dismissBanner }
}
