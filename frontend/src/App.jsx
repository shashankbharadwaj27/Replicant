import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "./store/useAuthStore.js";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Blogs from "./pages/Blogs.jsx";
import Diary from "./pages/Diary.jsx";
import Profile from "./pages/Profile.jsx";
import BlogView from "./pages/BlogView.jsx";
import DiaryView from "./pages/DiaryView.jsx";
import EditPost from "./pages/EditPost.jsx";
import Login from "./pages/Login.jsx";
import Create from "./pages/Create.jsx";

import QuizGame from "./pages/QuizGame.jsx";
import ScenarioGame from "./pages/ScenarioGame.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import GameCanvas from "./pages/GameCanvas.jsx";

export default function App() {
  const { token, restore } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restore();
    setLoading(false);
  }, [restore]);

  if (loading) return null;

  return (
    <Router>
      {token && <Navbar />} {/* Navbar visible only when logged in */}
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />

        {/* Main routes */}
        <Route path="/" element={token ? <Home /> : <Navigate to="/signup" />} />
        <Route path="/blogs" element={token ? <Blogs /> : <Navigate to="/signup" />} />
        <Route path="/diary" element={token ? <Diary /> : <Navigate to="/signup" />} />
        <Route path="/create" element={token ? <Create /> : <Navigate to="/signup" />} />
        <Route path="/profile/:username" element={token ? <Profile /> : <Navigate to="/signup" />} />
        <Route path="/blog/:id" element={token ? <BlogView /> : <Navigate to="/signup" />} />
        <Route path="/diary/:id" element={token ? <DiaryView /> : <Navigate to="/signup" />} />
        <Route path="/edit/:id" element={token ? <EditPost /> : <Navigate to="/signup" />} />

        {/* New Game Routes */}
        <Route path="/game" element={token ? <GameCanvas /> : <Navigate to="/signup" />} />
        <Route path="/leaderboard" element={token ? <Leaderboard /> : <Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
}
