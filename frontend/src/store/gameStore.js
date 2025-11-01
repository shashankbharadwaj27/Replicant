import { create } from "zustand";
import { updateGameScore, getLeaderboard } from "../utils/gameApi.js";

export const useGameStore = create((set, get) => ({
  // --- UI state ---
  showQuiz: false,
  currentQuestion: null,
  gameRunning: true,

  // --- Player stats ---
  score: 0,
  level: 1,
  progress: 0, // progress toward next level (0–100)

  // --- Leaderboard ---
  leaderboard: [],
  loading: false,

  // === UI Handlers ===
  setShowQuiz: (val) => set({ showQuiz: val }),
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  setGameRunning: (val) => set({ gameRunning: val }),

  // === Game Logic ===
  increaseScore: async (points = 0) => {
    if (!points) return;
    // Update local optimistically
    set((state) => {
      const newScore = state.score + points;
      const progress = newScore % 100;
      const level = state.level + (newScore >= state.level * 100 ? 1 : 0);
      return { score: newScore, progress, level };
    });

    try {
      await updateGameScore(points);
    } catch (error) {
      console.error("Error updating score on server:", error);
      // Optionally refetch leaderboard or user state from server here
    }
  },

  // Reset score locally and on server using existing updateGameScore endpoint
  resetScore: async () => {
    const currentScore = get().score;
    if (!currentScore) {
      set({ score: 0, progress: 0, level: 1 });
      return;
    }

    try {
      // send negative delta to bring server score to zero
      await updateGameScore(-currentScore);
      set({ score: 0, progress: 0, level: 1 });
    } catch (error) {
      console.error("Error resetting score on server:", error);
      // still reset locally so UI isn't stuck; you may want to reconcile later
      set({ score: 0, progress: 0, level: 1 });
    }
  },

  // === Leaderboard ===
  fetchLeaderboard: async () => {
    set({ loading: true });
    try {
      const topUsers = await getLeaderboard();
      set({ leaderboard: topUsers || [] });
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
