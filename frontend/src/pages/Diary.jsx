import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { getPosts } from "../utils/postApi.js";
import { useNavigate } from "react-router-dom";

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const { username } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) return;

    const fetchDiary = async () => {
      try {
        const posts = await getPosts(username);
        const privateEntries = posts.filter((post) => !post.isPublic);
        setEntries(privateEntries);
      } catch (error) {
        console.error("Failed to load diary entries:", error);
      }
    };

    fetchDiary();
  }, [username]);

  return (
    <div className="min-h-screen bg-[#14181C] text-gray-200 px-6 py-10">
      <h1 className="text-3xl font-bold text-[#00b020] mb-6">My Diary</h1>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div
              key={entry._id}
              className="border border-gray-700 rounded-lg p-4 hover:bg-[#1E2328] cursor-pointer transition"
              onClick={() => navigate(`/diary/${entry._id}`, { state: { post: entry } })}
            >
              <h2 className="text-xl font-semibold text-[#00b020]">{entry.title}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(entry.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-20">
            No diary entries yet.
          </p>
        )}
      </div>
    </div>
  );
}
