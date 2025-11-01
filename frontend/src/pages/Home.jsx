import React, { useEffect, useState } from "react";
import { getFeed } from "../utils/postApi.js";
import useAuthStore from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const { username } = useAuthStore();
  const [feed, setFeed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      if (!username) return;
      try {
        const posts = await getFeed(username);
        setFeed(posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeed();
  }, [username]);

  return (
    <div className="min-h-screen bg-[#14181C] text-gray-200 px-6 py-10">
      <h1 className="text-3xl font-bold text-[#00b020] mb-6">
        Latest from People You Follow
      </h1>

      {feed.length === 0 ? (
        <p className="text-gray-400">No posts to show.</p>
      ) : (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {feed.map((post) => (
            <motion.div
              key={post._id}
              className="relative border border-gray-700 rounded-lg p-4 hover:bg-[#1E2328] cursor-pointer transition flex flex-col justify-between"
              onClick={() => navigate(`/blog/${post._id}`)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Title and Username */}
              <div>
                <h2 className="text-xl font-semibold text-[#00b020]">{post.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{post.username}</p>
              </div>

              {/* Likes and Comments at bottom-right */}
              <div className="absolute bottom-2 right-2 flex gap-4 text-gray-400 text-sm">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
