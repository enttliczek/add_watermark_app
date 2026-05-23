import Dexie, { type Table } from 'dexie'
import type { Profile, SRSCard, ChatMessage, LearnSession } from '../types'

class VamosDatabase extends Dexie {
  profiles!: Table<Profile>
  srsCards!: Table<SRSCard>
  chatMessages!: Table<ChatMessage>
  learnSessions!: Table<LearnSession>

  constructor() {
    super('VamosDB')
    this.version(1).stores({
      profiles: 'id, name, type',
      srsCards: 'id, wordId, profileId, nextReview',
      chatMessages: 'id, profileId, timestamp',
      learnSessions: 'id, profileId, date',
    })
  }
}

export const db = new VamosDatabase()

export async function seedDefaultProfiles() {
  const count = await db.profiles.count()
  if (count > 0) return

  const now = Date.now()
  const defaults: Profile[] = [
    {
      id: 'kamil',
      name: 'Kamil',
      emoji: '👨',
      color: '#2563EB',
      colorDark: '#1D4ED8',
      type: 'adult',
      level: 'A2',
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      dailyGoalXP: 50,
      completedLessons: [],
      darkMode: false,
      speechRate: 0.9,
      createdAt: now,
    },
    {
      id: 'pati',
      name: 'Pati',
      emoji: '👩',
      color: '#7C3AED',
      colorDark: '#6D28D9',
      type: 'adult',
      level: 'A1',
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      dailyGoalXP: 30,
      completedLessons: [],
      darkMode: false,
      speechRate: 0.85,
      createdAt: now,
    },
    {
      id: 'amelka',
      name: 'Amelka',
      emoji: '👧',
      color: '#EC4899',
      colorDark: '#DB2777',
      type: 'child',
      level: 'dziecko',
      xp: 0,
      streak: 0,
      lastStudyDate: null,
      dailyGoalXP: 20,
      completedLessons: [],
      darkMode: false,
      speechRate: 0.75,
      createdAt: now,
    },
  ]

  await db.profiles.bulkAdd(defaults)
}

export async function getOrCreateSRSCard(wordId: string, profileId: string): Promise<SRSCard> {
  const existing = await db.srsCards.where({ wordId, profileId }).first()
  if (existing) return existing

  const card: SRSCard = {
    id: `${profileId}_${wordId}`,
    wordId,
    profileId: profileId as SRSCard['profileId'],
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: Date.now(),
    lastReview: null,
    totalReviews: 0,
    correctStreak: 0,
  }
  await db.srsCards.add(card)
  return card
}

export function computeSM2(card: SRSCard, quality: 0 | 1 | 2 | 3 | 4 | 5): SRSCard {
  let { interval, repetitions, easeFactor } = card

  if (quality >= 3) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    nextReview,
    lastReview: Date.now(),
    totalReviews: card.totalReviews + 1,
    correctStreak: quality >= 3 ? card.correctStreak + 1 : 0,
  }
}
