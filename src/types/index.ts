export interface Word {
  id: string
  es: string
  pl: string
  emoji: string
  exampleEs: string
  examplePl: string
  category: string
  difficulty: 1 | 2 | 3
  audioHintEs?: string
}

export type ProfileId = 'kamil' | 'pati' | 'amelka'
export type ProfileType = 'adult' | 'child'

export interface Profile {
  id: ProfileId
  name: string
  emoji: string
  color: string
  colorDark: string
  type: ProfileType
  level: string
  xp: number
  streak: number
  lastStudyDate: string | null
  dailyGoalXP: number
  completedLessons: string[]
  darkMode: boolean
  speechRate: number
  createdAt: number
}

export interface SRSCard {
  id: string
  wordId: string
  profileId: ProfileId
  interval: number
  repetitions: number
  easeFactor: number
  nextReview: number
  lastReview: number | null
  totalReviews: number
  correctStreak: number
}

export interface ChatMessage {
  id: string
  profileId: ProfileId
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface LearnSession {
  id: string
  profileId: ProfileId
  date: string
  wordsStudied: number
  xpEarned: number
  durationSeconds: number
}

export type ExerciseType = 'flashcard' | 'multiple-choice' | 'translation' | 'listening' | 'speaking'

export interface ExerciseResult {
  wordId: string
  correct: boolean
  responseTimeMs: number
  exerciseType: ExerciseType
}
