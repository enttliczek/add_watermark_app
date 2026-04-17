export function CorrectionCard({ correction }) {
  if (!correction || !correction.has_error) return null;
  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mx-2 mb-2 animate-bounce-in">
      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
        💡 Korekta
      </p>
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-duo-red font-bold flex-shrink-0">❌</span>
          <span className="text-gray-500 line-through">{correction.original}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-duo-green font-bold flex-shrink-0">✅</span>
          <span className="font-semibold text-duo-text">{correction.corrected}</span>
        </div>
        <div className="flex items-start gap-2 mt-1">
          <span className="flex-shrink-0">📝</span>
          <span className="text-gray-600">{correction.explanation_pl}</span>
        </div>
      </div>
    </div>
  );
}
