import { useState } from 'react'
import { useActiveProfile, useProfileStore } from '../store/profileStore'
import { db } from '../db/database'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'

export function SettingsPage() {
  const profile = useActiveProfile()
  const { updateProfile, loadProfiles } = useProfileStore()
  const [confirmReset, setConfirmReset] = useState(false)
  const [saved, setSaved] = useState(false)
  const [level, setLevel] = useState(profile?.level ?? 'A1')
  const [goal, setGoal] = useState(profile?.dailyGoalXP ?? 30)
  const [rate, setRate] = useState(profile?.speechRate ?? 0.85)
  const [dark, setDark] = useState(profile?.darkMode ?? false)

  if (!profile) return null

  const handleSave = async () => {
    await updateProfile(profile.id, {
      level,
      dailyGoalXP: goal,
      speechRate: rate,
      darkMode: dark,
    })
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = async () => {
    if (!confirmReset) { setConfirmReset(true); return }
    await db.srsCards.where('profileId').equals(profile.id).delete()
    await db.chatMessages.where('profileId').equals(profile.id).delete()
    await db.learnSessions.where('profileId').equals(profile.id).delete()
    await updateProfile(profile.id, { xp: 0, streak: 0, lastStudyDate: null, completedLessons: [] })
    await loadProfiles()
    setConfirmReset(false)
  }

  return (
    <div className="min-h-screen pb-24 pt-20 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Ustawienia</h1>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-5 space-y-4">
          <h2 className="font-bold text-gray-700 dark:text-gray-300">Profil: {profile.emoji} {profile.name}</h2>

          {profile.type === 'adult' && (
            <div>
              <label className="text-sm text-gray-500 block mb-1">Poziom języka</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              >
                {['A1', 'A2', 'B1', 'B2'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          )}

          {profile.type === 'adult' && (
            <div>
              <label className="text-sm text-gray-500 block mb-1">Cel dzienny: {goal} XP</label>
              <input
                type="range" min={10} max={200} step={10}
                value={goal} onChange={(e) => setGoal(+e.target.value)}
                className="w-full accent-violet-600"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>10</span><span>200</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-500 block mb-1">Tempo lektora: {rate.toFixed(2)}x</label>
            <input
              type="range" min={0.5} max={1.2} step={0.05}
              value={rate} onChange={(e) => setRate(+e.target.value)}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Wolno</span><span>Szybko</span>
            </div>
          </div>

          {profile.type === 'adult' && (
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Tryb ciemny</label>
              <button
                onClick={() => setDark(!dark)}
                className={`w-12 h-6 rounded-full transition-colors ${dark ? 'bg-violet-600' : 'bg-gray-300'}`}
              >
                <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform m-0.5 ${dark ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          )}

          <Button onClick={handleSave} variant="primary" size="md" className="w-full" color={profile.color}>
            {saved ? '✅ Zapisano!' : 'Zapisz ustawienia'}
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-5 space-y-3">
          <h2 className="font-bold text-red-500">Strefa niebezpieczna</h2>
          <p className="text-sm text-gray-500">Usuwa WSZYSTKIE dane nauki tego profilu (SRS, historię, XP).</p>
          <Button
            onClick={handleReset}
            variant={confirmReset ? 'primary' : 'secondary'}
            size="md"
            className={`w-full ${confirmReset ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white' : 'border-red-300 text-red-500 hover:bg-red-50'}`}
          >
            {confirmReset ? '⚠️ Potwierdź reset!' : '🗑️ Resetuj postępy'}
          </Button>
          {confirmReset && (
            <button onClick={() => setConfirmReset(false)} className="w-full text-sm text-gray-400 hover:text-gray-600">
              Anuluj
            </button>
          )}
        </div>

        <motion.div
          className="text-center text-xs text-gray-300 dark:text-gray-600 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ¡Vamos! v1.0 · PWA · Vercel
        </motion.div>
      </div>
    </div>
  )
}
