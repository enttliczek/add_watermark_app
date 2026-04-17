import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const links = [
    { to: "/", label: "🏠 Lekcje" },
    { to: "/conversation", label: "💬 Rozmowa" },
    { to: "/profile", label: "👤 Profil" },
  ];

  return (
    <header className="bg-white border-b border-duo-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇪🇸</span>
          <span className="font-extrabold text-lg text-duo-text">SpanishAI</span>
        </div>
        <nav className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
                location.pathname === l.to
                  ? "bg-duo-green text-white"
                  : "text-duo-muted hover:bg-gray-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
