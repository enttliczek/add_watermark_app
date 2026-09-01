import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useActiveProfile, useProfileStore } from '../store/profileStore'
import { db } from '../db/database'
import { XPBar } from '../components/ui/XPBar'

export function HomePage() {
  const profile = useActiveProfile()
  const { updateStreak } = useProfileStore()
  const navigate = useNavigate()
  const [dueCount, setDueCount] = useState(0)

  useEffect(() => {
    if (!profile) return
    updateStreak(profile.id)

    db.srsCards
      .where('profileId').equals(profile.id)
      .and((c) => c.nextReview <= Date.now())
      .count()
      .then(setDueCount)
  }, [profile?.id])

  if (!profile) return null

  const isChild = profile.type === 'child'

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-lg mx-auto space-y-5">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="text-5xl">{profile.emoji}</div>
          <h1 className="text-2xl font-black mt-1 text-gray-800 dark:text-white">
            ¡Hola, {profile.name}!
          </h1>
          {isChild && (
            <p className="text-gray-500 text-lg mt-1">Lola czeka na Ciebie! 🦙</p>
          )}
        </motion.div>

        {!isChild && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-md"
          >
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Cel dzienny: {profile.xp % profile.dailyGoalXP}/{profile.dailyGoalXP} XP</span>
              <span>🔥 {profile.streak} dni z rzędu</span>
            </div>
            <XPBar xp={profile.xp} goal={profile.dailyGoalXP} color={profile.color} />
          </motion.div>
        )}

        <div className={`grid gap-4 ${isChild ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <QuickCard
            icon="📚"
            title={isChild ? 'Uczę się!' : 'Nauka'}
            subtitle={isChild ? 'Nowe słówka z Lolą' : 'Nowe słówka'}
            color={profile.color}
            onClick={() => navigate('/learn')}
            isChild={isChild}
          />
          {dueCount > 0 && (
            <QuickCard
              icon="🔄"
              title={isChild ? 'Powtarzam!' : 'Powtórki'}
              subtitle={isChild ? `${dueCount} słówek czeka!` : `${dueCount} do powtórki`}
              color="#10B981"
              onClick={() => navigate('/review')}
              isChild={isChild}
              badge={dueCount}
            />
          )}
          <QuickCard
            icon="💬"
            title={isChild ? 'Rozmawiam!' : 'Czat'}
            subtitle={isChild ? 'Pogadaj z Lolą' : 'Ćwicz z AI'}
            color="#F59E0B"
            onClick={() => navigate('/chat')}
            isChild={isChild}
          />
          {!isChild && (
            <QuickCard
              icon="📊"
              title="Statystyki"
              subtitle="Twoje postępy"
              color="#6366F1"
              onClick={() => navigate('/stats')}
              isChild={false}
            />
          )}
        </div>

        {isChild && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-center py-6"
          >
            <div className="text-8xl animate-bounce">🦙</div>
            <p className="text-pink-500 font-bold text-xl mt-2">Lola mówi: ¡Vamos!</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function QuickCard({
  icon, title, subtitle, color, onClick, isChild, badge,
}: {
  icon: string
  title: string
  subtitle: string
  color: string
  onClick: () => void
  isChild: boolean
  badge?: number
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-3xl shadow-lg text-white cursor-pointer ${
        isChild ? 'py-8 text-2xl min-h-[120px]' : 'py-6 text-lg'
      }`}
      style={{ backgroundColor: color }}
    >
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {badge}
        </span>
      )}
      <span className={isChild ? 'text-5xl' : 'text-3xl'}>{icon}</span>
      <span className="font-black">{title}</span>
      <span className="text-white/80 text-sm">{subtitle}</span>
    </motion.button>
  )
}
