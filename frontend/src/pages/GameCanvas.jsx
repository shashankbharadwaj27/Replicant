import Phaser from "phaser";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import QuizModal from "./QuizModal";
import { questions } from "../data/questions";

export default function GameCanvas() {
  const {
    showQuiz,
    setShowQuiz,
    setCurrentQuestion,
    gameRunning,
    setGameRunning,
  } = useGameStore();

  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showCollisionModal, setShowCollisionModal] = useState(false);
  const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const gameRef = useRef(null);
  const obstacleRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let obstacleTimer;

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "phaser-container",
      backgroundColor: "#01010a",
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 2000 }, debug: false },
      },
      scene: { preload, create, update },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    function preload() {
      this.load.image(
        "stars",
        "https://raw.githubusercontent.com/photonstorm/phaser-examples/master/examples/assets/misc/starfield.jpg"
      );
      this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
      this.load.image("player", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
      this.load.image("obstacle", "https://labs.phaser.io/assets/games/asteroids/asteroid2.png");
    }

    function create() {
      const bg = this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, "stars");
      bg.setOrigin(0, 0).setScrollFactor(0);

      const ground = this.physics.add.staticGroup();
      ground
        .create(window.innerWidth / 2, window.innerHeight - 50, "ground")
        .setScale(5, 2)
        .refreshBody()
        .setTint(0x222244);

      playerRef.current = this.physics.add
        .sprite(150, window.innerHeight - 150, "player")
        .setScale(1.5)
        .setTint(0x00ff88);

      playerRef.current.setCollideWorldBounds(true);
      this.physics.add.collider(playerRef.current, ground);

      obstacleRef.current = this.physics.add
        .sprite(window.innerWidth + 100, window.innerHeight - 120, "obstacle")
        .setScale(Phaser.Math.FloatBetween(0.8, 1))
        .setTint(0xff4500);
      obstacleRef.current.body.setAllowGravity(false);
      this.physics.add.collider(obstacleRef.current, ground);

      // SPACE key logic
      this.input.keyboard.on("keydown-SPACE", () => {
        const state = useGameStore.getState();
        if (!state.gameRunning || state.showQuiz || document.querySelector(".modal-active")) return;

        const distance = Math.abs(obstacleRef.current.x - playerRef.current.x);
        const onGround = playerRef.current.body.touching.down;

        if (distance < 100 && onGround) {
          const randomQ = questions[Math.floor(Math.random() * questions.length)];
          setGameRunning(false);
          setShowQuiz(true);
          setCurrentQuestion(randomQ);
        } else if (onGround) {
          playerRef.current.setVelocityY(-550);
        }
      });

      // Collision detection
      this.physics.add.collider(playerRef.current, obstacleRef.current, () => {
        if (gameRunning) {
          setGameRunning(false);
          setPoints(0);
          setShowCollisionModal(true);
        }
      });

      obstacleTimer = setInterval(() => {
        if (gameRunning && obstacleRef.current.x < -50) {
          obstacleRef.current.x = window.innerWidth + 100;
        }
      }, 1500);

      this.bg = bg;
    }

    function update() {
      const scene = this;
      if (scene.bg) scene.bg.tilePositionX += 1.5;

      if (gameRunning && obstacleRef.current) {
        obstacleRef.current.x -= 6 + level * 0.5; // Increase difficulty per level
        if (obstacleRef.current.x < -50) obstacleRef.current.x = window.innerWidth + 100;
      }
    }

    return () => {
      clearInterval(obstacleTimer);
      game.destroy(true);
    };
  }, [gameRunning, showQuiz, level]);

  // 🧠 Handle quiz answers
  const handleAnswer = (selectedId) => {
    const { currentQuestion } = useGameStore.getState();
    const isCorrect = selectedId === currentQuestion.correct;

    // Increase answered question count
    setQuestionsAnswered((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) endLevel(); // End level after 5 questions
      return newCount;
    });

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      setPoints((prev) => prev + 10);
      setShowQuiz(false);
      resumeGame();
      if (obstacleRef.current) obstacleRef.current.x = window.innerWidth + 100;
    } else {
      setShowQuiz(false);
      setShowWrongAnswerModal(true);
    }
  };

  const endLevel = () => {
    setGameRunning(false);
    setShowLevelComplete(true);
  };

  const resumeGame = () => {
    const scene = gameRef.current.scene.keys.default;
    if (scene && scene.physics.world.isPaused) {
      scene.physics.world.resume();
    }
    setGameRunning(true);
  };

  const handleRestart = () => {
    setPoints(0);
    setShowCollisionModal(false);
    setShowWrongAnswerModal(false);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setGameRunning(true);
    if (obstacleRef.current) obstacleRef.current.x = window.innerWidth + 100;
    if (playerRef.current) playerRef.current.setY(window.innerHeight - 150);
  };

  const handleHome = () => {
    window.location.href = "/";
  };

  const handleNextLevel = () => {
    setLevel((prev) => prev + 1);
    setShowLevelComplete(false);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setPoints(0);
    setGameRunning(true);
    if (obstacleRef.current) obstacleRef.current.x = window.innerWidth + 100;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#01010a] via-[#050518] to-[#000000]">
      <div id="phaser-container" className="relative w-full h-full">
        {/* HUD */}
        <div className="absolute top-6 left-6 z-20 text-[#00ff88] font-mono text-lg font-bold drop-shadow-[0_0_10px_#00ff88] space-y-1">
          <p>Points: {points}</p>
          <p>Level: {level}</p>
          <p>Questions: {questionsAnswered}/5</p>
          <p>Correct: {correctAnswers}</p>
        </div>

        {/* Title */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20">
          <h1 className="text-5xl font-bold text-[#00bfff] drop-shadow-[0_0_25px_#00bfff] font-mono animate-pulse">
            SPACE RUNNER 🚀
          </h1>
          <p className="text-sm text-[#a0a0ff] font-mono mt-2 tracking-widest">
            Dodge meteors. Outsmart scams.
          </p>
        </div>

        {/* Background Glows */}
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00bfff] opacity-10 blur-[150px]" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#ff4500] opacity-10 blur-[150px]" />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-[#ffffff] opacity-5 blur-[100px]" />

        {/* 🧠 Quiz Modal */}
        {showQuiz && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md modal-active">
            <div className="p-8 bg-gradient-to-br from-[#080a16] to-[#141633] border border-[#00bfff] shadow-[0_0_20px_#00bfff,0_0_40px_#ff4500] rounded-2xl max-w-md w-full text-center text-white font-mono">
              <QuizModal onAnswer={handleAnswer} />
            </div>
          </div>
        )}

        {/* 💥 Collision Modal */}
        {showCollisionModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md modal-active">
            <div className="p-8 bg-gradient-to-br from-[#160808] to-[#311414] border border-[#ff4500] shadow-[0_0_20px_#ff4500,0_0_40px_#ff0000] rounded-2xl max-w-md w-full text-center text-white font-mono">
              <h2 className="text-3xl font-bold text-[#ff4500] mb-4 animate-pulse">
                💀 You Crashed!
              </h2>
              <p className="text-[#ffaaaa] mb-6">Watch out for those meteors, pilot!</p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={handleRestart}
                  className="px-6 py-2 bg-[#00ff88] text-black font-bold rounded-xl shadow-[0_0_10px_#00ff88] hover:scale-105 transition"
                >
                  🔁 Restart
                </button>
                <button
                  onClick={handleHome}
                  className="px-6 py-2 bg-[#ff4500] text-white font-bold rounded-xl shadow-[0_0_10px_#ff4500] hover:scale-105 transition"
                >
                  🏠 Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ❌ Wrong Answer Modal */}
        {showWrongAnswerModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md modal-active">
            <div className="p-8 bg-gradient-to-br from-[#1a0a0a] to-[#301010] border border-[#ff0000] shadow-[0_0_25px_#ff0000,0_0_50px_#ff4500] rounded-2xl max-w-md w-full text-center text-white font-mono">
              <h2 className="text-3xl font-bold text-[#ff5555] mb-4 animate-pulse">
                ❌ Wrong Answer!
              </h2>
              <p className="text-[#ffbbbb] mb-6">
                That wasn’t quite right. Study up and try again!
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => {
                    setShowWrongAnswerModal(false);
                    resumeGame();
                  }}
                  className="px-6 py-2 bg-[#00ff88] text-black font-bold rounded-xl shadow-[0_0_10px_#00ff88] hover:scale-105 transition"
                >
                  Continue
                </button>
                <button
                  onClick={handleRestart}
                  className="px-6 py-2 bg-[#ff4500] text-white font-bold rounded-xl shadow-[0_0_10px_#ff4500] hover:scale-105 transition"
                >
                  Restart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 Level Complete Modal */}
        {showLevelComplete && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md modal-active">
            <div className="p-8 bg-gradient-to-br from-[#081616] to-[#143331] border border-[#00ff88] shadow-[0_0_25px_#00ff88,0_0_50px_#00ffcc] rounded-2xl max-w-md w-full text-center text-white font-mono">
              <h2 className="text-3xl font-bold text-[#00ff88] mb-4 animate-pulse">
                🌟 Level {level} Complete!
              </h2>
              <p className="text-[#b2ffb2] mb-6">
                You answered {correctAnswers} out of 5 correctly!
              </p>
              <button
                onClick={handleNextLevel}
                className="px-6 py-2 bg-[#00ff88] text-black font-bold rounded-xl shadow-[0_0_10px_#00ff88] hover:scale-105 transition"
              >
                🚀 Next Level
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Neon Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#00bfff] via-[#ff4500] to-[#00bfff] blur-sm animate-pulse" />
    </div>
  );
}