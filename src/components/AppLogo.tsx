type Size = 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  className?: string
}

const sizeConfig = {
  sm: {
    text: 'text-base',
    badge: 'w-4 h-4 text-[10px]',
  },
  md: {
    text: 'text-xl',
    badge: 'w-5 h-5 text-xs',
  },
  lg: {
    text: 'text-3xl',
    badge: 'w-7 h-7 text-sm',
  },
}

export function AppLogo({ size = 'md', className = '' }: Props) {
  const cfg = sizeConfig[size]

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className={`font-bold text-[#FF0033] ${cfg.text}`}>PayPay</span>
      <span
        className={`bg-[#FF0033] text-white font-bold rounded-full flex items-center justify-center ${cfg.badge}`}
      >
        +
      </span>
    </div>
  )
}
