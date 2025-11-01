import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const { leaderboard, fetchLeaderboard, loading } = useGameStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return (
    <div className="min-h-screen bg-[#14181C] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1E2328] rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-[#00b020] text-center">
          🏆 Global Leaderboard
        </h2>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {leaderboard?.length > 0 ? (
              leaderboard.map((user, index) => (
                
                <li
                  key={user.username}
                  className="flex justify-between items-center bg-[#14181C] px-4 py-2 rounded-lg border border-gray-700"
                >
                  <span className="text-gray-300">
                    {index + 1}. <button onClick={() => navigate(`/profile/${user.username}`)}>{user.username}</button>
                  </span>
                  <span className="text-[#00b020] font-semibold">
                    {user.gameScore} pts
                  </span>
                </li>
                
              ))
            ) : (
              <p className="text-gray-400 text-center">No data yet.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 
