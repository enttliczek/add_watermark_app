import { useEffect, useState } from "react";
import { fetchStats } from "../api/progress";

export function ProfilePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-duo-muted animate-pulse">Ładowanie...</div>
      </div>
    );
  }

  const pct = stats.total_lessons > 0 ? Math.round((stats.completed_lessons / stats.total_lessons) * 100) : 0;

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="text-center">
        <div className="text-6xl mb-3">👤</div>
        <h1 className="text-2xl font-extrabold text-duo-text">Twój profil</h1>
        <p className="text-duo-muted text-sm mt-1">Śledź swoje postępy</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-duo-border p-5 text-center shadow-sm">
          <p className="text-4xl font-extrabold text-duo-gold">{stats.total_xp}</p>
          <p className="text-xs text-duo-muted mt-1 font-medium">Łączne XP</p>
        </div>
        <div className="bg-white rounded-2xl border border-duo-border p-5 text-center shadow-sm">
          <p className="text-4xl font-extrabold text-duo-green">{stats.completed_lessons}</p>
          <p className="text-xs text-duo-muted mt-1 font-medium">Ukończone lekcje</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-duo-border p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <p className="font-bold text-sm text-duo-text">Postęp kursu</p>
          <p className="text-sm font-bold text-duo-green">{pct}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-duo-green h-3 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-duo-muted mt-2">
          {stats.completed_lessons} z {stats.total_lessons} lekcji ukończonych
        </p>
      </div>

      {/* Motivation */}
      <div className="bg-gradient-to-r from-duo-green to-duo-blue rounded-2xl p-5 text-white text-center">
        <p className="text-2xl mb-1">
          {pct === 100 ? "🏆" : pct >= 60 ? "🔥" : pct >= 20 ? "⚡" : "🌱"}
        </p>
        <p className="font-bold">
          {pct === 100
            ? "Kurs ukończony! Gratulacje!"
            : pct >= 60
            ? "Świetny postęp! Nie zatrzymuj się!"
            : pct >= 20
            ? "Dobra robota! Kontynuuj naukę!"
            : "Zaczynasz przygodę z hiszpańskim!"}
        </p>
      </div>
    </div>
  );
}
