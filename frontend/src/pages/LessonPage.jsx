import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchLesson, checkAnswer } from "../api/lessons";
import { completeLesson } from "../api/progress";
import { useAppStore } from "../store/appStore";
import { ProgressBar } from "../components/layout/ProgressBar";
import { HeartBar } from "../components/ui/HeartBar";
import { ExerciseFeedback } from "../components/exercises/ExerciseFeedback";
import { TranslationExercise } from "../components/exercises/TranslationExercise";
import { MultipleChoiceExercise } from "../components/exercises/MultipleChoiceExercise";
import { FillBlankExercise } from "../components/exercises/FillBlankExercise";
import { WordOrderExercise } from "../components/exercises/WordOrderExercise";

const EXERCISE_COMPONENTS = {
  translation_en_es: TranslationExercise,
  translation_es_en: TranslationExercise,
  multiple_choice: MultipleChoiceExercise,
  fill_blank: FillBlankExercise,
  word_order: WordOrderExercise,
};

export function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startLesson, completeExercise, nextExercise, currentLesson, currentExerciseIndex, lives, sessionAnswers } = useAppStore();

  const [feedback, setFeedback] = useState(null); // null | {correct, correctAnswer, audioText}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson(Number(id)).then((lesson) => {
      startLesson(lesson);
      setLoading(false);
    });
  }, [id]);

  if (loading || !currentLesson) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-duo-muted animate-pulse">Ładowanie lekcji...</div>
      </div>
    );
  }

  const exercises = currentLesson.exercises;
  const exercise = exercises[currentExerciseIndex];

  async function handleSubmit(userAnswer) {
    if (feedback) return;
    const result = await checkAnswer(exercise.id, userAnswer);
    completeExercise(exercise.id, result.correct);
    setFeedback({
      correct: result.correct,
      correctAnswer: result.correct_answer,
      audioText: result.audio_text,
    });
  }

  function handleNext() {
    setFeedback(null);
    if (lives <= 0 && !feedback?.correct) {
      // Out of lives — end lesson with 0 score
      finishLesson(0);
      return;
    }
    if (currentExerciseIndex + 1 >= exercises.length) {
      const correctCount = sessionAnswers.filter((a) => a.correct).length + (feedback?.correct ? 1 : 0);
      const score = Math.round((correctCount / exercises.length) * 100);
      finishLesson(score);
    } else {
      nextExercise();
    }
  }

  function finishLesson(score) {
    completeLesson(currentLesson.id, score, lives).then(() => {
      navigate(`/lesson/${currentLesson.id}/complete`, { state: { score, lives } });
    });
  }

  const ExComponent = EXERCISE_COMPONENTS[exercise?.exercise_type];

  return (
    <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 py-6 pb-48">
      {/* Header bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-duo-muted hover:text-duo-text text-lg"
        >
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar current={currentExerciseIndex} total={exercises.length} />
        </div>
        <HeartBar lives={lives} />
      </div>

      <h2 className="font-extrabold text-xl text-duo-text mb-6">{currentLesson.title}</h2>

      {ExComponent && (
        <ExComponent
          key={exercise.id}
          exercise={exercise}
          onSubmit={handleSubmit}
        />
      )}

      {feedback && (
        <ExerciseFeedback
          correct={feedback.correct}
          correctAnswer={feedback.correctAnswer}
          audioText={feedback.audioText}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
