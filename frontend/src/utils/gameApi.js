import { axiosInstance as API } from "./axiosInstance";


export const updateGameScore = async (scoreChange, newLevel) => {
  const res = await API.patch("/game/patch/updateprogress", {
    scoreChange,
    newLevel,
  });
  return res.data;
};


export const getLeaderboard = async () => {
  const res = await API.get("/game/get/leaderboard");
  return res.data.topUsers;
};
