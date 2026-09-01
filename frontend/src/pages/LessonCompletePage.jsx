import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function LessonCompletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const score = state?.score ?? 0;
  const lives = state?.lives ?? 0;
  const stars = lives >= 3 ? 3 : lives >= 2 ? 2 : lives >= 1 ? 1 : 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto px-4 py-12 text-center gap-6">
      <div className="text-6xl animate-bounce-in">
        {score >= 80 ? "🏆" : score >= 50 ? "🎉" : "💪"}
      </div>
      <h1 className="text-3xl font-extrabold text-duo-text">
        {score >= 80 ? "Znakomicie!" : score >= 50 ? "Dobra robota!" : "Dobry start!"}
      </h1>

      {/* Stars */}
      <div className="flex gap-2 text-4xl">
        {[1, 2, 3].map((s) => (
          <span key={s} className={s <= stars ? "text-duo-gold" : "text-gray-200"}>★</span>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-duo-border shadow-md p-6 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-duo-green">{score}%</p>
            <p className="text-xs text-duo-muted mt-1">Wynik</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-extrabold text-duo-blue">+20</p>
            <p className="text-xs text-duo-muted mt-1">XP zdobyte</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Button onClick={() => navigate(`/lesson/${id}`)}>
          Powtórz lekcję
        </Button>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Wróć do lekcji
        </Button>
      </div>
    </div>
  );
}
