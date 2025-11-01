import { useState, useEffect } from "react";
import { scenarioQuestions } from "../data/scenarioQuestions";
import { useGameStore } from "../store/gameStore";
import { getLeaderboard as getLeaderboardApi, updateGameScore as updateGameScoreApi } from "../utils/gameApi";

const ScenarioGame = () => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [finished, setFinished] = useState(false);
  const { leaderboard, setLeaderboard } = useGameStore();

  const handleAnswer = (optionId) => {
    setSelected(optionId);
    const correct = scenarioQuestions[current].correctOption;
    if (optionId === correct) setScore((prev) => prev + 1);
  };

  const nextQuestion = async () => {
    if (current < scenarioQuestions.length - 1) {
      setCurrent((prev) => prev + 1);
      setSelected("");
    } else {
      setFinished(true);
      await updateGameScoreApi(score);
      const updated = await getLeaderboardApi();
      setLeaderboard(updated);
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0a0f0d] p-4">
        <h1 className="text-3xl font-bold mb-4 text-green-400">Game Over!</h1>
        <p className="text-xl mb-6">Your Score: {score}</p>
        <Leaderboard />
      </div>
    );
  }

  const q = scenarioQuestions[current];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f0d] text-white p-6">
      <h2 className="text-2xl font-bold mb-6">{q.question}</h2>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {q.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.id)}
            className={`p-3 rounded-xl border border-gray-600 hover:bg-gray-800 transition ${
              selected === opt.id ? "bg-green-700" : ""
            }`}
          >
            {opt.id.toUpperCase()}. {opt.text}
          </button>
        ))}
      </div>
      <button
        onClick={nextQuestion}
        className="mt-8 px-6 py-2 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition"
      >
        {current < scenarioQuestions.length - 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
};

export default ScenarioGame;
