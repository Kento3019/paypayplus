type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  maxLength?: number
  placeholder?: string
  type?: string
}

export function FormField({ label, value, onChange, error, maxLength, placeholder, type = 'text' }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/50 bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
