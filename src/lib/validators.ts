import { MSG } from './messages'

export function validateTitle(value: string): string | undefined {
  if (value.trim() === '') return MSG.validation.titleRequired
  if (value.length > 20) return MSG.validation.titleMaxLength
  return undefined
}

export function validateAmount(value: string): string | undefined {
  if (value === '') return MSG.validation.amountRequired
  if (!/^\d+$/.test(value)) return MSG.validation.amountNumericOnly
  const num = parseInt(value, 10)
  if (num < 1) return MSG.validation.amountMin
  if (num >= 1000000) return MSG.validation.amountMax
  return undefined
}

export function validatePayPayUrl(value: string): string | undefined {
  if (value === '') return undefined
  try {
    const url = new URL(value)
    if (!url.hostname.endsWith('paypay.ne.jp')) return MSG.validation.payPayUrlDomain
  } catch {
    return MSG.validation.payPayUrlInvalid
  }
  return undefined
}

export function validateName(value: string): string | undefined {
  if (value.trim() === '') return MSG.validation.nameRequired
  if (value.length > 10) return MSG.validation.nameMaxLength
  return undefined
}
