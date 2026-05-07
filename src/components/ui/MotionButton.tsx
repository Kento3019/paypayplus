import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-darker disabled:opacity-50',
  secondary: 'border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50',
  ghost: 'text-gray-600 hover:text-gray-900',
}

type Props = {
  children: ReactNode
  onClick?: () => void
  variant?: Variant
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit'
  'aria-label'?: string
}

export function MotionButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={disabled || loading ? undefined : { scale: 0.95 }}
      className={`${variantClass[variant]} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  )
}
