type Size = 'sm' | 'md' | 'lg'

type Props = {
  size?: Size
  className?: string
}

const sizeConfig = {
  sm: { text: 'text-base' },
  md: { text: 'text-xl' },
  lg: { text: 'text-3xl' },
}

export function AppLogo({ size = 'md', className = '' }: Props) {
  const cfg = sizeConfig[size]

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <span className={`font-bold text-primary ${cfg.text}`}>OKU</span>
      <span className={`font-bold text-gray-700 ${cfg.text}`}>LINK</span>
    </div>
  )
}
