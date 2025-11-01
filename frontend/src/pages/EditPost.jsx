import { useState, useEffect } from "react";
import { updatePost, getPost } from "../utils/postApi.js";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [originalPost, setOriginalPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [msg, setMsg] = useState("");

  // Fetch post when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPost(id);
        setOriginalPost(res);
        setTitle(res.title);
        setContent(res.content);
        setIsPublic(res.isPublic);
      } catch (err) {
        console.error("Error fetching post:", err);
        setMsg("Failed to load post.");
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setMsg("Title and content cannot be empty");
      return;
    }

    try {
  const updated = await updatePost({
    _id: originalPost._id,
    title,
    content,
    isPublic,
  });

  if (!updated) throw new Error();

  setMsg("Post updated successfully!");

  // Redirect to correct page after a short delay
  setTimeout(() => {
    navigate(isPublic ? "/blogs" : "/diary");
  }, 500);
} catch (err) {
  console.error("Error updating post:", err);
  setMsg("Error updating post");
}

  };

  if (!originalPost) {
    return (
      <p className="text-center text-gray-400 mt-20">Loading post...</p>
    );
  }

  return (
    <div className="min-h-screen bg-[#14181C] text-gray-200 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg border border-gray-700 bg-[#1E2328] rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-[#00b020] text-center">
          Edit Post
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
            placeholder="Write your content..."
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
            Save Changes
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
