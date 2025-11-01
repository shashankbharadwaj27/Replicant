import { useEffect, useState } from "react";
import { updateLikes, addComment, deleteComment, getPosts , getPost , deletePost} from "../utils/postApi.js";
import { useNavigate, useParams ,useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { motion } from "framer-motion";

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { username } = useAuthStore();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const location = useLocation();
  

  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id);
      setPost(res);
    };
    fetchPost();
  }, [id, username]);

  const handleLike = async () => {
    if (!username) return;
    const updated = await updateLikes(post._id, username);
    setPost(updated);
  };

  const handleAddComment = async () => {
    const updated = await addComment(post, { commentContent: commentText, commentUser: username });
    setPost(updated);
    setCommentText("");
  };

  const handleDeleteComment = async (comment) => {
    const updated = await deleteComment(post, comment);
    setPost(updated);
  };

  const handleDeletePost = async () => {
    await deletePost(post);
    navigate("/blogs");
  }

  if (!post)
    return (
      <div className="min-h-screen bg-[#14181C] text-gray-400 flex items-center justify-center">
        Loading blog...
      </div>
    );

  const isOwner = post.username === username;

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
        {/* LEFT COLUMN - Blog Metadata */}
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

            <motion.h1
              className="text-2xl font-bold text-[#00b020]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {post.title}
            </motion.h1>

            <p className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

            <motion.button
              onClick={handleLike}
              className="mt-3 px-4 py-2 border border-[#00b020] text-[#00b020] rounded-md hover:bg-[#00b020] hover:text-black transition"
              whileTap={{ scale: 0.9 }}
            >
              ❤️ {post.likes?.length || 0}
            </motion.button>

            {isOwner && (
              <>
              <motion.button
                onClick={() => navigate(`/edit/${post._id}`)}
                className="mt-2 px-4 py-2 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </motion.button>
              <motion.button
                onClick={handleDeletePost}
                className="mt-2 px-4 py-2 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Blog Content and Comments */}
        <div className="md:w-2/3 flex flex-col gap-6">
          {/* Blog Content */}
          <motion.div
          className="bg-[#1E2328] border border-gray-700 rounded-xl p-6 shadow-md leading-relaxed text-gray-300 whitespace-pre-wrap break-words"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          >
          {post.content}
          </motion.div>

          {/* Comments Section */}
          <motion.div
            className="bg-[#1E2328] border border-gray-700 rounded-xl p-6 shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <h2 className="text-xl font-semibold text-[#00b020] mb-4 border-b border-gray-700 pb-2">
              Comments ({post.comments?.length || 0})
            </h2>

            {/* Comments List */}
            <motion.div
              className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
              layout
            >
              {post.comments?.length > 0 ? (
                post.comments.map((comment, index) => (
                  <motion.div
                    key={comment._id}
                    className="flex justify-between items-start bg-[#161A1E] border border-gray-700 rounded-lg p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div>
                      <span
                        onClick={() => navigate(`/profile/${comment.username}`)}
                        className="text-[#00b020] font-semibold cursor-pointer hover:underline"
                      >
                        {comment.username}
                      </span>
                      <p className="text-gray-300 mt-1">{comment.comment}</p>
                    </div>

                    {(comment.username === username || isOwner) && (
                      <motion.button
                        onClick={() => handleDeleteComment(comment)}
                        className="text-gray-500 hover:text-red-500 text-sm"
                        whileTap={{ scale: 0.9 }}
                      >
                        🗑️
                      </motion.button>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </motion.div>

            {/* Add Comment */}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-[#00b020] resize-none text-gray-200"
              />
              <motion.button
                onClick={handleAddComment}
                className="mt-3 px-4 py-2 bg-[#00b020] text-black rounded-md hover:bg-[#009019] transition"
                whileTap={{ scale: 0.95 }}
              >
                Post Comment
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
