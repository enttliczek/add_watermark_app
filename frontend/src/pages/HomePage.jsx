import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLessons } from "../api/lessons";
import { fetchLessonProgress } from "../api/progress";

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5 justify-center mt-1">
      {[1, 2, 3].map((s) => (
        <span key={s} className={`text-xs ${s <= stars ? "text-duo-gold" : "text-gray-300"}`}>★</span>
      ))}
    </div>
  );
}

export function HomePage() {
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchLessons(), fetchLessonProgress()])
      .then(([lessons, prog]) => {
        setLessons(lessons);
        const map = {};
        prog.forEach((p) => { map[p.lesson_id] = p; });
        setProgress(map);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-duo-muted text-lg animate-pulse">Ładowanie lekcji...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-center text-duo-text mb-2">
        🇪🇸 Nauka Hiszpańskiego
      </h1>
      <p className="text-center text-duo-muted text-sm mb-8">
        Wybierz lekcję, aby rozpocząć naukę
      </p>

      <div className="flex flex-col items-center gap-4">
        {lessons.map((lesson, idx) => {
          const prog = progress[lesson.id];
          const completed = prog?.completed;
          const stars = prog?.stars ?? 0;
          const isFirst = idx === 0;
          const prevCompleted = idx === 0 || progress[lessons[idx - 1]?.id]?.completed;
          const locked = !isFirst && !prevCompleted;

          return (
            <div key={lesson.id} className="flex flex-col items-center w-full">
              {idx > 0 && (
                <div className={`w-0.5 h-8 ${completed ? "bg-duo-green" : "bg-gray-300"}`} />
              )}
              <button
                onClick={() => !locked && navigate(`/lesson/${lesson.id}`)}
                disabled={locked}
                className={`
                  w-full max-w-xs rounded-2xl p-4 flex items-center gap-4 border-2 shadow-md
                  transition-all duration-150 active:scale-95
                  ${completed
                    ? "bg-duo-green border-duo-green-dark text-white"
                    : locked
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    : "bg-white border-duo-green text-duo-text hover:shadow-lg"
                  }
                `}
              >
                <span className="text-3xl">{lesson.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm">{lesson.title}</div>
                  <div className={`text-xs mt-0.5 ${completed ? "text-green-100" : "text-duo-muted"}`}>
                    {lesson.description}
                  </div>
                  {completed && <StarRating stars={stars} />}
                </div>
                <div className="text-right">
                  {locked ? (
                    <span className="text-lg">🔒</span>
                  ) : completed ? (
                    <span className="text-lg">✅</span>
                  ) : (
                    <span className="text-xs font-bold text-duo-green bg-green-50 px-2 py-1 rounded-full">
                      +{lesson.xp_reward} XP
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
