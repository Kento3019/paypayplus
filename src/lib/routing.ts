const HASH_PATTERN = /^[a-z0-9]{8,12}$/
const PROD_ROOM_ID = import.meta.env.VITE_PROD_ROOM_ID as string

export type RouteResult =
  | { type: 'room'; roomId: string }
  | { type: 'redirect'; roomId: string }
  | { type: 'notFound' }

function generateRandomHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const length = 8 + Math.floor(Math.random() * 5)
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function resolveRoute(hash: string): RouteResult {
  if (!window.location.href.includes('#')) {
    return { type: 'notFound' }
  }

  if (hash === '' || hash === '#') {
    return { type: 'redirect', roomId: generateRandomHash() }
  }

  const hashId = hash.startsWith('#') ? hash.slice(1) : hash

  if (hashId === '') {
    return { type: 'redirect', roomId: generateRandomHash() }
  }

  if (hashId === PROD_ROOM_ID || HASH_PATTERN.test(hashId)) {
    return { type: 'room', roomId: hashId }
  }

  return { type: 'notFound' }
}

export function getCurrentHash(): string {
  return window.location.hash
}

export function navigateToHash(roomId: string): void {
  window.location.hash = roomId
}
