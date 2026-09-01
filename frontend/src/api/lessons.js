import axios from "axios";

export const fetchLessons = () => axios.get("/api/lessons").then((r) => r.data);

export const fetchLesson = (id) =>
  axios.get(`/api/lessons/${id}`).then((r) => r.data);

export const checkAnswer = (exerciseId, userAnswer) =>
  axios
    .post("/api/exercises/check", { exercise_id: exerciseId, user_answer: userAnswer })
    .then((r) => r.data);
