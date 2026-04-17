import { useState } from "react";
import { SpeakButton } from "../ui/SpeakButton";

export function MultipleChoiceExercise({ exercise, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const options = JSON.parse(exercise.options || "[]");

  function handleSelect(opt) {
    if (selected !== null) return;
    setSelected(opt);
    setTimeout(() => onSubmit(opt), 600);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-duo-muted text-sm font-medium uppercase tracking-wide">Wybierz poprawną odpowiedź:</p>
      <div className="bg-white rounded-2xl p-5 border border-duo-border shadow-sm flex items-center gap-3">
        <SpeakButton text={exercise.audio_text} />
        <p className="text-lg font-semibold text-duo-text">{exercise.question}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let style = "bg-white border-2 border-duo-border hover:border-duo-blue hover:bg-blue-50";
          if (selected === opt) {
            style = opt === exercise.correct_answer
              ? "bg-green-50 border-2 border-duo-green text-duo-green-dark"
              : "bg-red-50 border-2 border-duo-red text-duo-red";
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`${style} rounded-2xl p-4 text-sm font-semibold text-duo-text transition-all duration-150 active:scale-95`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
