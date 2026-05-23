import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useActiveProfile } from '../store/profileStore'
import { db } from '../db/database'
import type { LearnSession, SRSCard } from '../types'

export function StatsPage() {
  const profile = useActiveProfile()
  const [sessions, setSessions] = useState<LearnSession[]>([])
  const [cardStats, setCardStats] = useState({ total: 0, known: 0, due: 0 })

  useEffect(() => {
    if (!profile) return

    db.learnSessions
      .where('profileId').equals(profile.id)
      .reverse()
      .limit(14)
      .toArray()
      .then((s) => setSessions(s.reverse()))

    Promise.all([
      db.srsCards.where('profileId').equals(profile.id).count(),
      db.srsCards.where('profileId').equals(profile.id).and((c: SRSCard) => c.repetitions >= 3).count(),
      db.srsCards.where('profileId').equals(profile.id).and((c: SRSCard) => c.nextReview <= Date.now()).count(),
    ]).then(([total, known, due]) => setCardStats({ total, known, due }))
  }, [profile?.id])

  if (!profile) return null

  const chartData = sessions.map((s) => ({
    name: s.date.slice(5),
    XP: s.xpEarned,
    słówka: s.wordsStudied,
  }))

  const totalWords = sessions.reduce((sum, s) => sum + s.wordsStudied, 0)
  const avgSession = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / sessions.length)
    : 0

  return (
    <div className="min-h-screen pb-24 pt-20 px-4">
      <div className="max-w-lg mx-auto space-y-5">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Twoje statystyki</h1>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon="🔥" label="Seria dni" value={profile.streak} color={profile.color} />
          <StatCard icon="⚡" label="Łączne XP" value={profile.xp} color={profile.color} />
          <StatCard icon="📚" label="Słówek razem" value={totalWords} color="#10B981" />
          <StatCard icon="⏱️" label="Śr. sesja (s)" value={avgSession} color="#F59E0B" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-5">
          <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-4">Karty SRS</h2>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-black text-violet-600">{cardStats.total}</div>
              <div className="text-xs text-gray-400">Wszystkie</div>
            </div>
            <div>
              <div className="text-2xl font-black text-green-500">{cardStats.known}</div>
              <div className="text-xs text-gray-400">Opanowane</div>
            </div>
            <div>
              <div className="text-2xl font-black text-red-500">{cardStats.due}</div>
              <div className="text-xs text-gray-400">Do powtórki</div>
            </div>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-5">
            <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-4">XP ostatnie 14 dni</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="XP" fill={profile.color} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-5xl mb-2">📊</div>
            <p>Brak danych. Zacznij się uczyć!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-4 flex items-center gap-3">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-xl font-black" style={{ color }}>{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}
