import { useState } from "react";
import { addPost } from "../utils/postApi.js";
import useAuthStore from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [msg, setMsg] = useState("");

  const { username } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMsg("Title and content are required");
      return;
    }

    try {
      const post = await addPost({ title, content, isPublic, username });
      if (!post) throw new Error();

      setMsg("Post created successfully!");
      setTitle("");
      setContent("");
      setIsPublic(false);

      setTimeout(() => {
        navigate(isPublic ? "/blogs" : "/diary");
      }, 1000);
    } catch {
      setMsg("Error occurred while creating post");
    }
  };

  return (
    <div className="min-h-screen bg-[#14181C] text-gray-200 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg border border-gray-700 bg-[#1E2328] rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-[#00b020] text-center">
          Create Post
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            className="p-3 bg-[#111] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00b020]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your thoughts..."
            rows="6"
            className="p-3 bg-[#111] text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00b020]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setIsPublic((prev) => !prev)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isPublic
                ? "bg-[#00b020] text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {isPublic ? "Public" : "Private"}
          </button>

          <button
            type="submit"
            className="bg-[#00b020] text-black font-semibold py-2 rounded-lg hover:bg-[#00c030] transition"
          >
            Create
          </button>
        </form>

        {msg && (
          <p className="text-center text-sm text-gray-400 mt-2 transition-all">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
