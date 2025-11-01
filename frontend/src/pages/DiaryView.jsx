import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost, deletePost, getPost } from "../utils/postApi.js";
import useAuthStore from "../store/useAuthStore.js";
import { motion } from "framer-motion";

export default function DiaryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { username } = useAuthStore();
  const [post, setPost] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id);
      setPost(res);
      setTitle(res.title);
      setContent(res.content);
      setIsPublic(res.isPublic);
    };
    fetchPost();
  }, [id]);

  if (!post)
    return (
      <div className="min-h-screen bg-[#14181C] text-gray-400 flex items-center justify-center">
        Loading diary...
      </div>
    );

  const isOwner = post.username === username;

  const handleSave = async () => {
    await updatePost({ _id: post._id, title, content, isPublic });
    setPost({ ...post, title, content, isPublic });
    setIsEditing(false);
    navigate(isPublic ? "/blogs" : "/diary");
  };

  const handleDelete = async () => {
    await deletePost(post);
    navigate("/diary");
  };

  const togglePrivacy = () => setIsPublic((prev) => !prev);

  return (
    <motion.div
      className="min-h-screen bg-[#14181C] text-gray-200 flex justify-center px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col md:flex-row w-full max-w-6xl gap-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        {/* LEFT COLUMN - Metadata */}
        <motion.div
          className="md:w-1/3 bg-[#1E2328] border border-gray-700 rounded-xl p-6 shadow-md h-fit"
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-start gap-3">
            <motion.div
              onClick={() => navigate(`/profile/${post.username}`)}
              className="text-lg font-semibold text-[#00b020] hover:underline cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              {post.username}
            </motion.div>

            {isEditing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-[#00b020] bg-[#111] border border-gray-700 rounded-xl p-2 w-full focus:outline-none focus:border-[#00c896]"
              />
            ) : (
              <motion.h1
                className="text-2xl font-bold text-[#00b020]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h1>
            )}

            <p className="text-gray-400 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>

            {isOwner && isEditing && (
              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={togglePrivacy}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    isPublic ? "bg-green-600 hover:bg-green-700 text-black" : "bg-gray-600 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  {isPublic ? "Public" : "Private"}
                </button>

                <motion.button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#00c896] text-black rounded-md hover:bg-[#1de9b6] transition"
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>

                <motion.button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition"
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Diary
                </motion.button>
              </div>
            )}

            {isOwner && !isEditing && (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#00b020] text-black rounded-md hover:bg-[#00c896] transition mt-3"
                whileTap={{ scale: 0.95 }}
              >
                Edit Diary
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Content */}
        <motion.div
          className="md:w-2/3 bg-[#1E2328] border border-gray-700 rounded-xl p-6 shadow-md leading-relaxed text-gray-300 whitespace-pre-line"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-60 bg-[#111] text-gray-200 rounded-xl p-4 border border-gray-700 focus:outline-none focus:border-[#00c896]"
            />
          ) : (
            <p>{content}</p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
