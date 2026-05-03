const HASH_PATTERN = /^[a-z0-9]{8,12}$/
const PROD_ROOM_ID = import.meta.env.VITE_PROD_ROOM_ID as string | undefined

export type RouteResult =
  | { type: 'welcome' }
  | { type: 'create' }
  | { type: 'share'; roomId: string }
  | { type: 'settings'; roomId: string }
  | { type: 'room'; roomId: string }
  | { type: 'notFound' }

export function generateRandomHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const length = 8 + Math.floor(Math.random() * 5)
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function resolveRoute(hash: string): RouteResult {
  if (!window.location.href.includes('#')) {
    return { type: 'welcome' }
  }

  const hashId = hash.startsWith('#') ? hash.slice(1) : hash

  if (hashId === '' || hashId === '#') {
    return { type: 'welcome' }
  }

  if (hashId === 'create') {
    return { type: 'create' }
  }

  if (hashId.startsWith('share/')) {
    const roomId = hashId.slice('share/'.length)
    if (roomId !== '' && (HASH_PATTERN.test(roomId) || roomId === PROD_ROOM_ID)) {
      return { type: 'share', roomId }
    }
    return { type: 'notFound' }
  }

  if (hashId.startsWith('settings/')) {
    const roomId = hashId.slice('settings/'.length)
    if (roomId !== '' && (HASH_PATTERN.test(roomId) || roomId === PROD_ROOM_ID)) {
      return { type: 'settings', roomId }
    }
    return { type: 'notFound' }
  }

  if ((PROD_ROOM_ID && hashId === PROD_ROOM_ID) || HASH_PATTERN.test(hashId)) {
    return { type: 'room', roomId: hashId }
  }

  return { type: 'notFound' }
}

export function getCurrentHash(): string {
  return window.location.hash
}

export function navigateToHash(hash: string): void {
  window.location.hash = hash
}
