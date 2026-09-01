import { useState } from "react";
import { SpeakButton } from "../ui/SpeakButton";
import { Button } from "../ui/Button";

export function FillBlankExercise({ exercise, onSubmit }) {
  const [value, setValue] = useState("");
  const parts = exercise.question.split("_____");

  return (
    <div className="flex flex-col gap-4">
      <p className="text-duo-muted text-sm font-medium uppercase tracking-wide">Uzupełnij lukę:</p>
      <div className="bg-white rounded-2xl p-5 border border-duo-border shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-lg font-semibold text-duo-text">
          <SpeakButton text={exercise.audio_text} />
          <span>{parts[0]}</span>
          <input
            className="border-b-2 border-duo-blue outline-none text-center text-duo-blue font-bold min-w-[80px] max-w-[160px] bg-transparent"
            style={{ width: `${Math.max(80, value.length * 14)}px` }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) onSubmit(value.trim());
            }}
            placeholder="..."
            autoFocus
          />
          {parts[1] && <span>{parts[1]}</span>}
        </div>
        {exercise.hint && (
          <p className="text-xs text-duo-muted mt-2">Wskazówka: {exercise.hint}</p>
        )}
      </div>
      <Button onClick={() => onSubmit(value.trim())} disabled={!value.trim()}>
        Sprawdź
      </Button>
    </div>
  );
}
