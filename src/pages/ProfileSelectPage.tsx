import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProfileStore } from '../store/profileStore'
import type { Profile, ProfileId } from '../types'

export function ProfileSelectPage() {
  const { profiles, loadProfiles, setActiveProfile } = useProfileStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadProfiles()
  }, [loadProfiles])

  const handleSelect = (id: ProfileId) => {
    setActiveProfile(id)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <div className="text-6xl mb-3">🦙</div>
        <h1 className="text-4xl font-black text-violet-700 dark:text-violet-300">¡Vamos!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">Kto dzisiaj się uczy?</p>
      </motion.div>

      <div className="w-full max-w-sm flex flex-col gap-4 md:max-w-2xl md:flex-row md:flex-wrap md:justify-center">
        {profiles.map((profile, i) => (
          <ProfileCard key={profile.id} profile={profile} index={i} onSelect={handleSelect} />
        ))}
      </div>

      <p className="mt-10 text-xs text-gray-400 text-center">
        Przytrzymaj ikonę profilu w górnym rogu, by zmienić profil podczas nauki
      </p>
    </div>
  )
}

function ProfileCard({
  profile,
  index,
  onSelect,
}: {
  profile: Profile
  index: number
  onSelect: (id: ProfileId) => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const studiedToday = profile.lastStudyDate === today

  return (
    <motion.button
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(profile.id)}
      className="flex items-center gap-5 p-5 rounded-3xl shadow-lg cursor-pointer text-left w-full md:w-56 md:flex-col md:items-center md:text-center"
      style={{ backgroundColor: profile.color }}
    >
      <div className="text-5xl md:text-6xl">{profile.emoji}</div>
      <div className="flex-1">
        <div className="text-white font-black text-xl">{profile.name}</div>
        <div className="text-white/80 text-sm">{profile.level}</div>
        <div className="flex items-center gap-3 mt-2 md:justify-center">
          <span className="text-white/90 text-sm">🔥 {profile.streak}</span>
          <span className="text-white/90 text-sm">⚡ {profile.xp} XP</span>
          {studiedToday && <span className="text-white text-sm">✅</span>}
        </div>
      </div>
      {profile.type === 'child' && (
        <div className="text-2xl md:mt-1">🦙</div>
      )}
    </motion.button>
  )
}
