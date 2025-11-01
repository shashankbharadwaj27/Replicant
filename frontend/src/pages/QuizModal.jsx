import { useGameStore } from "../store/gameStore";
import { questions } from "../data/questions";

export default function QuizModal({ onAnswer }) {
  const { currentQuestion } = useGameStore();

  if (!currentQuestion) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-gray-900 text-white p-6 rounded-xl w-96 shadow-2xl border border-green-400">
        <h2 className="text-lg font-bold mb-4">{currentQuestion.question}</h2>
        <div className="space-y-2">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onAnswer(opt.id)}
              className="block w-full bg-gray-800 hover:bg-green-700 transition p-2 rounded-md text-left"
            >
              {opt.id.toUpperCase()}. {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}