import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  // Lesson session
  currentLesson: null,
  currentExerciseIndex: 0,
  sessionAnswers: [],
  lives: 3,

  // Conversation
  messages: [],

  startLesson: (lesson) =>
    set({ currentLesson: lesson, currentExerciseIndex: 0, sessionAnswers: [], lives: 3 }),

  completeExercise: (exerciseId, correct) => {
    const { lives, sessionAnswers } = get();
    set({
      sessionAnswers: [...sessionAnswers, { exerciseId, correct }],
      lives: correct ? lives : Math.max(0, lives - 1),
    });
  },

  nextExercise: () =>
    set((s) => ({ currentExerciseIndex: s.currentExerciseIndex + 1 })),

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  setMessages: (messages) => set({ messages }),

  clearConversation: () => set({ messages: [] }),
}));
