import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, ProfileId } from '../types'
import { db } from '../db/database'

interface ProfileStore {
  activeProfileId: ProfileId | null
  profiles: Profile[]
  setActiveProfile: (id: ProfileId) => void
  loadProfiles: () => Promise<void>
  updateProfile: (id: ProfileId, updates: Partial<Profile>) => Promise<void>
  addXP: (id: ProfileId, amount: number) => Promise<void>
  updateStreak: (id: ProfileId) => Promise<void>
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      activeProfileId: null,
      profiles: [],

      setActiveProfile: (id) => set({ activeProfileId: id }),

      loadProfiles: async () => {
        const profiles = await db.profiles.toArray()
        set({ profiles })
      },

      updateProfile: async (id, updates) => {
        await db.profiles.update(id, updates)
        const profiles = await db.profiles.toArray()
        set({ profiles })
      },

      addXP: async (id, amount) => {
        const profile = get().profiles.find((p) => p.id === id)
        if (!profile) return
        await db.profiles.update(id, { xp: profile.xp + amount })
        const profiles = await db.profiles.toArray()
        set({ profiles })
      },

      updateStreak: async (id) => {
        const profile = get().profiles.find((p) => p.id === id)
        if (!profile) return

        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

        let newStreak = profile.streak
        if (profile.lastStudyDate === today) return
        if (profile.lastStudyDate === yesterday) newStreak += 1
        else newStreak = 1

        await db.profiles.update(id, { streak: newStreak, lastStudyDate: today })
        const profiles = await db.profiles.toArray()
        set({ profiles })
      },
    }),
    {
      name: 'vamos-profile',
      partialize: (state) => ({ activeProfileId: state.activeProfileId }),
    }
  )
)

export function useActiveProfile(): Profile | null {
  const { activeProfileId, profiles } = useProfileStore()
  return profiles.find((p) => p.id === activeProfileId) ?? null
}
