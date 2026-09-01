import { useState } from "react";
import { SpeakButton } from "../ui/SpeakButton";
import { Button } from "../ui/Button";

export function WordOrderExercise({ exercise, onSubmit }) {
  const allWords = JSON.parse(exercise.words_pool || "[]");
  const [sentence, setSentence] = useState([]);
  const [pool, setPool] = useState([...allWords]);

  function addWord(word, idx) {
    setSentence((s) => [...s, word]);
    setPool((p) => p.filter((_, i) => i !== idx));
  }

  function removeWord(word, idx) {
    setPool((p) => [...p, word]);
    setSentence((s) => s.filter((_, i) => i !== idx));
  }

  const answer = sentence.join(" ");

  return (
    <div className="flex flex-col gap-4">
      <p className="text-duo-muted text-sm font-medium uppercase tracking-wide">Ułóż zdanie:</p>
      <div className="bg-white rounded-2xl p-4 border border-duo-border shadow-sm flex items-start gap-2">
        <SpeakButton text={exercise.audio_text} />
        <p className="text-sm text-duo-muted">{exercise.question}</p>
      </div>

      {/* Sentence build area */}
      <div className="min-h-[56px] bg-gray-50 rounded-2xl border-2 border-dashed border-duo-border p-3 flex flex-wrap gap-2 items-center">
        {sentence.length === 0 && (
          <span className="text-duo-muted text-sm">Kliknij słowa poniżej...</span>
        )}
        {sentence.map((word, i) => (
          <button
            key={i}
            onClick={() => removeWord(word, i)}
            className="bg-white border-2 border-duo-blue text-duo-text px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-red-50 hover:border-duo-red transition-colors"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word pool */}
      <div className="flex flex-wrap gap-2">
        {pool.map((word, i) => (
          <button
            key={i}
            onClick={() => addWord(word, i)}
            className="bg-white border-2 border-duo-border text-duo-text px-3 py-1.5 rounded-xl text-sm font-semibold hover:border-duo-blue hover:bg-blue-50 transition-colors"
          >
            {word}
          </button>
        ))}
      </div>

      <Button onClick={() => onSubmit(answer)} disabled={sentence.length === 0}>
        Sprawdź
      </Button>
    </div>
  );
}
