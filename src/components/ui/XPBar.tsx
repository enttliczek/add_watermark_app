interface XPBarProps {
  xp: number
  goal: number
  color: string
}

export function XPBar({ xp, goal, color }: XPBarProps) {
  const pct = Math.min(100, (xp % goal) / goal * 100)
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}
