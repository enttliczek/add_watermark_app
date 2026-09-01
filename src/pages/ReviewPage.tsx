import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useActiveProfile, useProfileStore } from '../store/profileStore'
import { db, computeSM2 } from '../db/database'
import { useSpeech } from '../hooks/useSpeech'
import { Button } from '../components/ui/Button'
import vocabData from '../data/starter_vocab_es.json'
import type { Word, SRSCard } from '../types'
import Confetti from '../components/ui/Confetti'

const vocab = vocabData as Word[]
const vocabMap = Object.fromEntries(vocab.map((w) => [w.id, w]))

export function ReviewPage() {
  const profile = useActiveProfile()
  const { addXP } = useProfileStore()
  const { speak } = useSpeech()
  const [cards, setCards] = useState<SRSCard[]>([])
  const [current, setCurrent] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [sessionXP, setSessionXP] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  const isChild = profile?.type === 'child'

  useEffect(() => {
    if (!profile) return
    db.srsCards
      .where('profileId').equals(profile.id)
      .and((c) => c.nextReview <= Date.now())
      .toArray()
      .then((c) => {
        setCards(c.slice(0, isChild ? 5 : 20))
        setLoading(false)
      })
  }, [profile?.id])

  const card = cards[current]
  const word = card ? vocabMap[card.wordId] : null

  useEffect(() => {
    if (word && !showAnswer) speak(word.es)
  }, [card?.id, showAnswer])

  const handleResult = async (quality: 0 | 3 | 5) => {
    if (!profile || !card || !word) return

    const updated = computeSM2(card, quality)
    await db.srsCards.put(updated)

    const xp = quality === 5 ? 8 : quality === 3 ? 4 : 1
    await addXP(profile.id, xp)
    setSessionXP((s) => s + xp)

    if (quality >= 3) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1200)
    }

    if (current + 1 >= cards.length) {
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
      setShowAnswer(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-spin">🔄</div>
      </div>
    )
  }

  if (!profile) return null

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center pb-24 pt-20">
        <div className="text-7xl mb-4">🎯</div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Brak powtórek!</h2>
        <p className="text-gray-500">
          {isChild ? 'Lola jest z Ciebie dumna! 🦙' : 'Wszystkie karty są aktualne. Wróć jutro!'}
        </p>
      </div>
    )
  }

  if (done) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
      >
        <Confetti />
        <div className="text-7xl mb-4">⭐</div>
        <h2 className="text-3xl font-black mb-2 text-gray-800 dark:text-white">Powtórki gotowe!</h2>
        <p className="text-gray-500 text-lg">Zdobyłeś ⚡{sessionXP} XP</p>
      </motion.div>
    )
  }

  if (!word) return null

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 flex flex-col items-center">
      {showConfetti && <Confetti />}
      <div className="w-full max-w-lg">
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{current + 1} / {cards.length} powtórek</span>
          <span>⚡ +{sessionXP} XP</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center"
          >
            <div className={`${isChild ? 'text-9xl' : 'text-7xl'} mb-4`}>{word.emoji}</div>
            <div className={`font-black ${isChild ? 'text-4xl' : 'text-3xl'} text-gray-800 dark:text-white mb-2`}>
              {word.es}
            </div>
            <button onClick={() => speak(word.es)} className="text-3xl mb-4 hover:scale-110 transition-transform">
              🔊
            </button>

            {!showAnswer ? (
              <div>
                <p className="text-gray-400 mb-5">Co to znaczy po polsku?</p>
                <Button
                  onClick={() => setShowAnswer(true)}
                  variant="kid"
                  color={profile.color}
                  size={isChild ? 'xl' : 'lg'}
                  className="w-full"
                >
                  {isChild ? '💡 Pokaż!' : 'Pokaż odpowiedź'}
                </Button>
              </div>
            ) : (
              <div>
                <div className={`${isChild ? 'text-3xl' : 'text-2xl'} font-bold text-violet-600 dark:text-violet-300 mb-6`}>
                  {word.pl}
                </div>
                {isChild ? (
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => handleResult(0)} variant="kid" color="#EF4444" size="xl">😕 Nie</Button>
                    <Button onClick={() => handleResult(5)} variant="kid" color="#10B981" size="xl">✅ Tak!</Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => handleResult(0)} variant="secondary" size="md" className="flex-1 text-red-500">
                      😕 Nie
                    </Button>
                    <Button onClick={() => handleResult(3)} variant="secondary" size="md" className="flex-1">
                      🤔 Prawie
                    </Button>
                    <Button onClick={() => handleResult(5)} variant="primary" size="md" className="flex-1">
                      ✅ Znam
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 text-xs text-gray-400">
              Powtórzono {card.totalReviews}x · Seria: {card.correctStreak}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
