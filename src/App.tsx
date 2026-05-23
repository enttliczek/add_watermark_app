import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProfileSelectPage } from './pages/ProfileSelectPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { ReviewPage } from './pages/ReviewPage'
import { ChatPage } from './pages/ChatPage'
import { StatsPage } from './pages/StatsPage'
import { SettingsPage } from './pages/SettingsPage'
import { Navigation } from './components/Navigation'
import { TopBar } from './components/TopBar'
import { useProfileStore } from './store/profileStore'
import { seedDefaultProfiles } from './db/database'

function RequireProfile({ children }: { children: React.ReactNode }) {
  const { activeProfileId } = useProfileStore()
  if (!activeProfileId) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { activeProfileId, loadProfiles } = useProfileStore()

  useEffect(() => {
    seedDefaultProfiles().then(() => loadProfiles())
  }, [])

  useEffect(() => {
    const profiles = useProfileStore.getState().profiles
    const active = profiles.find((p) => p.id === activeProfileId)
    if (active?.darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [activeProfileId])

  return (
    <div className="font-sans antialiased">
      <Routes>
        <Route path="/" element={<ProfileSelectPage />} />
        <Route
          path="/*"
          element={
            <RequireProfile>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                <TopBar />
                <Routes>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/review" element={<ReviewPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
                <Navigation />
              </div>
            </RequireProfile>
          }
        />
      </Routes>
    </div>
  )
}
