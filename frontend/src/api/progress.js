import axios from "axios";

export const fetchStats = () => axios.get("/api/progress").then((r) => r.data);

export const fetchLessonProgress = () =>
  axios.get("/api/progress/lessons").then((r) => r.data);

export const completeLesson = (lessonId, score, livesRemaining) =>
  axios
    .post(`/api/progress/lessons/${lessonId}/complete`, {
      score,
      lives_remaining: livesRemaining,
    })
    .then((r) => r.data);
