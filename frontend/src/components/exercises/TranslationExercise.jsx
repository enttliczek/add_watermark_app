import { useState } from "react";
import { SpeakButton } from "../ui/SpeakButton";
import { Button } from "../ui/Button";

export function TranslationExercise({ exercise, onSubmit }) {
  const [value, setValue] = useState("");

  const label =
    exercise.exercise_type === "translation_en_es"
      ? "Przetłumacz na hiszpański:"
      : "Przetłumacz na polski:";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-duo-muted text-sm font-medium uppercase tracking-wide">{label}</p>
      <div className="bg-white rounded-2xl p-5 border border-duo-border shadow-sm flex items-start gap-3">
        <SpeakButton text={exercise.audio_text} />
        <p className="text-lg font-semibold text-duo-text leading-snug">
          {exercise.hint || exercise.audio_text}
        </p>
      </div>
      <textarea
        className="w-full rounded-2xl border-2 border-duo-border p-4 text-base outline-none focus:border-duo-blue resize-none"
        rows={3}
        placeholder="Wpisz odpowiedź..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault();
            onSubmit(value.trim());
          }
        }}
      />
      <Button onClick={() => onSubmit(value.trim())} disabled={!value.trim()}>
        Sprawdź
      </Button>
    </div>
  );
}
