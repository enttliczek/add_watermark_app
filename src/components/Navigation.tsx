import { NavLink } from 'react-router-dom'
import { useActiveProfile } from '../store/profileStore'

const links = [
  { to: '/home', icon: '🏠', label: 'Home' },
  { to: '/learn', icon: '📚', label: 'Nauka' },
  { to: '/review', icon: '🔄', label: 'Powtórki' },
  { to: '/chat', icon: '💬', label: 'Czat' },
  { to: '/stats', icon: '📊', label: 'Statystyki' },
  { to: '/settings', icon: '⚙️', label: 'Ustawienia' },
]

export function Navigation() {
  const profile = useActiveProfile()
  const color = profile?.color ?? '#7C3AED'

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-pb">
      <div className="flex justify-around items-center py-1 max-w-lg mx-auto">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`text-2xl transition-transform ${isActive ? 'scale-110' : ''}`}
                >
                  {icon}
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? color : undefined }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
