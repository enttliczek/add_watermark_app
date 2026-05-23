import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useActiveProfile, useProfileStore } from '../store/profileStore'
import { db, getOrCreateSRSCard, computeSM2 } from '../db/database'
import { useSpeech } from '../hooks/useSpeech'
import { Button } from '../components/ui/Button'
import vocabData from '../data/starter_vocab_es.json'
import type { Word, SRSCard } from '../types'
import Confetti from '../components/ui/Confetti'

const vocab = vocabData as Word[]

type Phase = 'front' | 'back' | 'result'

export function LearnPage() {
  const profile = useActiveProfile()
  const { addXP } = useProfileStore()
  const { speak, speakPl } = useSpeech()
  const [queue, setQueue] = useState<Word[]>([])
  const [current, setCurrent] = useState(0)
  const [phase, setPhase] = useState<Phase>('front')
  const [showConfetti, setShowConfetti] = useState(false)
  const [sessionXP, setSessionXP] = useState(0)
  const [done, setDone] = useState(false)
  const [sessionStart] = useState(Date.now())
  const [kidTimer, setKidTimer] = useState<number>(0)

  const isChild = profile?.type === 'child'

  useEffect(() => {
    if (!profile) return
    const categoryWords = vocab.filter((w) => w.difficulty === 1)
    const shuffled = [...categoryWords].sort(() => Math.random() - 0.5).slice(0, isChild ? 5 : 10)
    setQueue(shuffled)
  }, [profile?.id])

  useEffect(() => {
    if (!isChild) return
    const t = setInterval(() => setKidTimer((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [isChild])

  const word = queue[current]

  useEffect(() => {
    if (!word) return
    if (phase === 'front') {
      if (isChild) {
        setTimeout(() => speakPl(word.pl), 300)
        setTimeout(() => speak(word.es), 1200)
      } else {
        speak(word.es)
      }
    }
  }, [word?.id, phase])

  const handleFlip = () => setPhase('back')

  const handleResult = async (quality: 0 | 3 | 5) => {
    if (!profile || !word) return

    const card = await getOrCreateSRSCard(word.id, profile.id)
    const updated = computeSM2(card as SRSCard, quality)
    await db.srsCards.put(updated)

    const xp = quality === 5 ? 10 : quality === 3 ? 5 : 2
    await addXP(profile.id, xp)
    setSessionXP((s) => s + xp)

    if (quality >= 3) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1500)
    }

    if (current + 1 >= queue.length) {
      await db.learnSessions.add({
        id: `${profile.id}_${Date.now()}`,
        profileId: profile.id,
        date: new Date().toISOString().split('T')[0],
        wordsStudied: queue.length,
        xpEarned: sessionXP + xp,
        durationSeconds: Math.round((Date.now() - sessionStart) / 1000),
      })
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
      setPhase('front')
    }
  }

  if (!profile || queue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-spin">⚡</div>
      </div>
    )
  }

  if (isChild && kidTimer >= 600) {
    return <KidTimerEnd />
  }

  if (done) {
    return <SessionEnd sessionXP={sessionXP} wordCount={queue.length} isChild={isChild} color={profile.color} />
  }

  return (
    <div className="min-h-screen pb-24 pt-20 px-4 flex flex-col items-center">
      {showConfetti && <Confetti />}
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>{current + 1} / {queue.length}</span>
          <span>⚡ +{sessionXP} XP</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{ width: `${((current + 1) / queue.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <FlashCard
            key={`${word.id}-${phase}`}
            word={word}
            phase={phase}
            isChild={isChild}
            color={profile.color}
            onSpeak={() => speak(word.es)}
            onFlip={handleFlip}
            onResult={handleResult}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

function FlashCard({
  word, phase, isChild, color, onSpeak, onFlip, onResult,
}: {
  word: Word
  phase: Phase
  isChild: boolean
  color: string
  onSpeak: () => void
  onFlip: () => void
  onResult: (q: 0 | 3 | 5) => void
}) {
  return (
    <motion.div
      initial={{ rotateY: -90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: 90, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
    >
      <div className="p-8 text-center">
        <div className={`${isChild ? 'text-9xl' : 'text-7xl'} mb-4`}>{word.emoji}</div>

        <div className={`font-black ${isChild ? 'text-4xl' : 'text-3xl'} text-gray-800 dark:text-white mb-2`}>
          {word.es}
        </div>

        {word.audioHintEs && (
          <div className="text-sm text-gray-400 mb-2 italic">/{word.audioHintEs}/</div>
        )}

        <button
          onClick={onSpeak}
          className="text-3xl hover:scale-110 transition-transform mb-4"
          title="Odtwórz wymowę"
        >
          🔊
        </button>

        {phase === 'front' ? (
          <div>
            <p className="text-gray-400 mb-6">Znasz to słówko?</p>
            <Button onClick={onFlip} size={isChild ? 'xl' : 'lg'} color={color} variant="kid" className="w-full">
              {isChild ? '👀 Pokaż!' : 'Pokaż odpowiedź'}
            </Button>
          </div>
        ) : (
          <div>
            <div className={`${isChild ? 'text-3xl' : 'text-2xl'} font-bold text-violet-600 dark:text-violet-300 mb-2`}>
              {word.pl}
            </div>
            <div className="text-sm text-gray-500 italic mb-6">
              „{word.exampleEs}"
            </div>
            {isChild ? (
              <div className="flex gap-3 justify-center">
                <Button onClick={() => onResult(0)} variant="kid" color="#EF4444" size="xl">
                  😕 Nie
                </Button>
                <Button onClick={() => onResult(5)} variant="kid" color="#10B981" size="xl">
                  ✅ Tak!
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => onResult(0)} variant="secondary" size="md" className="flex-1 border-red-200 text-red-500 hover:bg-red-50">
                  😕 Nie pamiętam
                </Button>
                <Button onClick={() => onResult(3)} variant="secondary" size="md" className="flex-1">
                  🤔 Prawie
                </Button>
                <Button onClick={() => onResult(5)} variant="primary" size="md" className="flex-1">
                  ✅ Znam!
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 text-xs text-gray-400 text-center">
        {word.category} · Poziom {word.difficulty}
      </div>
    </motion.div>
  )
}

function SessionEnd({ sessionXP, wordCount, isChild, color }: { sessionXP: number; wordCount: number; isChild: boolean; color: string }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
    >
      <Confetti />
      <div className="text-8xl mb-4">{isChild ? '🦙🎉' : '🎉'}</div>
      <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
        {isChild ? '¡Muy bien, Amelka!' : '¡Excelente!'}
      </h2>
      <p className="text-gray-500 text-lg mb-6">
        Nauczyłeś się {wordCount} słówek i zdobyłeś ⚡{sessionXP} XP!
      </p>
      <Button onClick={() => window.location.reload()} color={color} variant="kid" size="xl">
        {isChild ? '🔄 Jeszcze raz!' : 'Kolejna sesja'}
      </Button>
    </motion.div>
  )
}

function KidTimerEnd() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-purple-50"
    >
      <div className="text-8xl mb-4">🦙💤</div>
      <h2 className="text-3xl font-black text-purple-700 mb-2">Świetna robota!</h2>
      <p className="text-purple-500 text-xl">Lola idzie spać... do jutra!</p>
    </motion.div>
  )
}
