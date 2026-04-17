export function HeartBar({ lives, maxLives = 3 }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: maxLives }).map((_, i) => (
        <span key={i} className={`text-xl transition-all ${i < lives ? "opacity-100" : "opacity-25 grayscale"}`}>
          ❤️
        </span>
      ))}
    </div>
  );
}
