import { Button } from "../ui/Button";
import { SpeakButton } from "../ui/SpeakButton";

export function ExerciseFeedback({ correct, correctAnswer, audioText, onNext }) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 p-5 shadow-2xl transition-all animate-bounce-in
        ${correct ? "bg-green-50 border-t-4 border-duo-green" : "bg-red-50 border-t-4 border-duo-red"}`}
    >
      <div className="max-w-md mx-auto flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{correct ? "✅" : "❌"}</span>
          <div>
            <p className={`font-bold text-base ${correct ? "text-duo-green-dark" : "text-duo-red"}`}>
              {correct ? "Świetnie! Poprawna odpowiedź!" : "Błędna odpowiedź"}
            </p>
            {!correct && (
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">
                  Poprawna odpowiedź: <span className="font-bold">{correctAnswer}</span>
                </p>
                {audioText && <SpeakButton text={audioText} />}
              </div>
            )}
          </div>
        </div>
        <Button onClick={onNext} variant={correct ? "primary" : "danger"}>
          Dalej →
        </Button>
      </div>
    </div>
  );
}
