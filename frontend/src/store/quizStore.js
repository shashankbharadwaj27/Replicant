import { create } from "zustand";
import { getLeaderboard, updateGameScore, resetGameScore } from "../utils/gameApi";

const useGameStore = create((set, get) => ({
  // 🎮 Game stats for the current user
  score: 0,
  gamesPlayed: 0,
  leaderboard: [],
  loading: false,

  // ✅ Fetch global leaderboard
  fetchLeaderboard: async () => {
    set({ loading: true });
    try {
      const data = await getLeaderboard();
      set({ leaderboard: data, loading: false });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      set({ loading: false });
    }
  },

  // ⬆️ Update current user’s score
  increaseScore: async (change = 1) => {
    try {
      const res = await updateGameScore(change);
      set({ score: res.user.gameScore });
    } catch (err) {
      console.error("Error updating score:", err);
    }
  },

  // 🔄 Reset score for the user
  resetScore: async () => {
    try {
      const res = await resetGameScore();
      set({ score: res.user.gameScore });
    } catch (err) {
      console.error("Error resetting score:", err);
    }
  },
}));

export {useGameStore};
