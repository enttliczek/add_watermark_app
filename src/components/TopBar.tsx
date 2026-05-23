import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveProfile, useProfileStore } from '../store/profileStore'
import { XPBar } from './ui/XPBar'

export function TopBar() {
  const profile = useActiveProfile()
  const { setActiveProfile } = useProfileStore()
  const navigate = useNavigate()
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [holding, setHolding] = useState(false)

  if (!profile) return null

  const handleHoldStart = () => {
    setHolding(true)
    holdTimer.current = setTimeout(() => {
      setHolding(false)
      setActiveProfile(null as any)
      navigate('/')
    }, 1000)
  }

  const handleHoldEnd = () => {
    setHolding(false)
    if (holdTimer.current) clearTimeout(holdTimer.current)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 safe-area-pt">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-violet-600">¡Vamos!</span>
        </div>

        <div className="flex-1 mx-4">
          <XPBar xp={profile.xp} goal={profile.dailyGoalXP} color={profile.color} />
          <div className="flex justify-between mt-0.5 text-xs text-gray-500">
            <span>🔥 {profile.streak} dni</span>
            <span>⚡ {profile.xp} XP</span>
          </div>
        </div>

        <button
          onPointerDown={handleHoldStart}
          onPointerUp={handleHoldEnd}
          onPointerLeave={handleHoldEnd}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all select-none ${
            holding ? 'scale-95 ring-2 ring-red-400' : ''
          }`}
          style={{ backgroundColor: profile.color + '20' }}
          title="Przytrzymaj 1s, aby zmienić profil"
        >
          {profile.emoji}
          {holding && (
            <svg className="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20" cy="20" r="18"
                fill="none" stroke={profile.color} strokeWidth="3"
                strokeDasharray="113"
                strokeDashoffset="0"
                className="animate-[dash_1s_linear_forwards]"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
