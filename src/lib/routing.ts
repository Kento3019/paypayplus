export function generateRandomHash(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const length = 8 + Math.floor(Math.random() * 5)
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
