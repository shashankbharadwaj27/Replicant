import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";
import { getProfile, toggleFollow } from "../utils/userApi.js";
import { getPosts } from "../utils/postApi.js";
import { motion } from "framer-motion";

export default function Profile() {
  const params = useParams();
  const profileOwner = params.username;
  const { username } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [followersVisible, setFollowersVisible] = useState(false);
  const [followingVisible, setFollowingVisible] = useState(false);
  const [blogsCount, setBlogsCount] = useState(0);
  const [diaryCount, setDiaryCount] = useState(0);

  const isOwner = username === profileOwner;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileOwner) return;

      const data = await getProfile(profileOwner);
      setProfile(data);

      const posts = await getPosts(profileOwner);
      setBlogsCount(posts.filter(p => p.isPublic).length);
      if (isOwner) {
        setDiaryCount(posts.filter(p => !p.isPublic).length);
      }
    };

    fetchProfileData();
  }, [profileOwner, isOwner]);

  const handleFollowToggle = async () => {
    await toggleFollow(profileOwner);
    const updatedProfile = await getProfile(profileOwner);
    setProfile(updatedProfile);
  };

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#14181C]">
        Loading...
      </div>
    );

  const isFollowing = profile.followers.some(f => f.username === username);

  return (
    <div className="min-h-screen bg-[#14181C] text-gray-200 px-6 py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-24 h-24 bg-[#1E2328] rounded-full flex items-center justify-center text-2xl font-bold text-[#90C67C] shadow-md">
            {profileOwner[0].toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-[#90C67C]">{profileOwner}</h1>
            <p className="text-gray-400 mt-1">{profile.bio || "No bio provided"}</p>
          </div>
        </div>

        {/* Follow/Unfollow button */}
        {!isOwner && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFollowToggle}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
              isFollowing ? "bg-red-500 hover:bg-red-400" : "bg-green-500 hover:bg-green-400"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </motion.button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          className="bg-[#1E2328] p-4 rounded-xl flex flex-col items-center shadow-md hover:shadow-lg transition"
          whileHover={{ scale: 1.03 }}
        >
          <p className="text-gray-400 text-sm">Followers</p>
          <p className="text-xl font-bold text-[#E1EEBC]">{profile.followers.length}</p>
        </motion.div>

        <motion.div
          className="bg-[#1E2328] p-4 rounded-xl flex flex-col items-center shadow-md hover:shadow-lg transition"
          whileHover={{ scale: 1.03 }}
        >
          <p className="text-gray-400 text-sm">Following</p>
          <p className="text-xl font-bold text-[#E1EEBC]">{profile.following.length}</p>
        </motion.div>

        <motion.div
          className="bg-[#1E2328] p-4 rounded-xl flex flex-col items-center shadow-md hover:shadow-lg transition cursor-pointer"
          whileHover={{ scale: 1.03 }}
          onClick={() => navigate(`/blogs?user=${profileOwner}`)}
        >
          <p className="text-gray-400 text-sm">Blogs</p>
          <p className="text-xl font-bold text-[#90C67C]">{blogsCount}</p>
        </motion.div>

        {isOwner && (
          <motion.div
            className="bg-[#1E2328] p-4 rounded-xl flex flex-col items-center shadow-md hover:shadow-lg transition cursor-pointer"
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate(`/diary?user=${profileOwner}`)}
          >
            <p className="text-gray-400 text-sm">Diary</p>
            <p className="text-xl font-bold text-[#90C67C]">{diaryCount}</p>
          </motion.div>
        )}
      </div>

      {/* Followers / Following lists */}
      <div className="flex gap-6 flex-wrap mb-10">
        {/* Followers */}
        <div className="w-full md:w-1/2">
          <button
            className="text-gray-300 hover:text-[#E1EEBC] font-medium"
            onClick={() => setFollowersVisible(!followersVisible)}
          >
            Followers
          </button>
          {followersVisible && (
            <ul className="bg-[#1E2328] mt-2 p-3 rounded-xl max-h-64 overflow-y-auto shadow-md space-y-2">
              {profile.followers.map(f => (
                <li key={f._id}>
                  <button
                    className="text-[#90C67C] hover:underline font-medium"
                    onClick={() => navigate(`/profile/${f.username}`)}
                  >
                    {f.username}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Following */}
        <div className="w-full md:w-1/2">
          <button
            className="text-gray-300 hover:text-[#E1EEBC] font-medium"
            onClick={() => setFollowingVisible(!followingVisible)}
          >
            Following
          </button>
          {followingVisible && (
            <ul className="bg-[#1E2328] mt-2 p-3 rounded-xl max-h-64 overflow-y-auto shadow-md space-y-2">
              {profile.following.map(f => (
                <li key={f._id}>
                  <button
                    className="text-[#90C67C] hover:underline font-medium"
                    onClick={() => navigate(`/profile/${f.username}`)}
                  >
                    {f.username}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
