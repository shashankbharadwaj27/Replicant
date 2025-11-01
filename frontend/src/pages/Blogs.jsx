import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { getPosts } from "../utils/postApi.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const { username } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // if viewing someone else's blogs (e.g. /blogs?user=john)
  const queryParams = new URLSearchParams(location.search);
  const profileOwner = queryParams.get("user") || username;

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!profileOwner) return;
      const posts = await getPosts(profileOwner);
      setBlogs(posts.filter((post) => post.isPublic));
    };
    fetchBlogs();
  }, [profileOwner , location.key]);

  return (
    <div className="min-h-screen bg-[#14181C] text-gray-200 px-6 py-10">
      <h1 className="text-3xl font-bold text-[#00b020] mb-6">
        {profileOwner === username ? "My Blogs" : `${profileOwner}'s Blogs`}
      </h1>

      <div className="grid gap-4 max-w-3xl mx-auto">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="border border-gray-700 rounded-lg p-4 hover:bg-[#1E2328] transition"
            >
              {/* Blog Title */}
              <h2
                className="text-xl font-semibold text-[#00b020] cursor-pointer hover:underline"
                onClick={() => navigate(`/blog/${blog._id}`, { state: { blog } })}
              >
                {blog.title}
              </h2>

              {/* Blog Info */}
              <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                <p>{new Date(blog.createdAt).toLocaleDateString()}</p>

                {/* Author */}
                <button
                  className="text-[#90C67C] hover:underline"
                  onClick={() => navigate(`/profile/${blog.username}`)}
                >
                  {blog.username}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-20">
            {profileOwner === username
              ? "You haven’t written any blogs yet."
              : "No blogs available for this user."}
          </p>
        )}
      </div>
    </div>
  );
}
