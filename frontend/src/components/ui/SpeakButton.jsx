import { useTTS } from "../../hooks/useTTS";

export function SpeakButton({ text, className = "" }) {
  const { speak } = useTTS();
  if (!text) return null;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-duo-blue text-white hover:bg-blue-500 transition-colors ${className}`}
      title="Posłuchaj wymowy"
    >
      🔊
    </button>
  );
}
