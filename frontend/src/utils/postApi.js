import {axiosInstance} from "./axiosInstance";

export const getPost = async (postId) => {
  const res = await axiosInstance.get(`/posts/id/${postId}`);
  return res.data.post ;
}

export const getPosts = async (username) => {
  const res = await axiosInstance.get(`/posts/${username}`);
  return res.data.posts;
};


export const changeStatus = async (postId) => {
  const res = await axiosInstance.patch(`/posts/${postId}/status`);
  return res.data.post;
};


export const addPost = async (post) => {
  const res = await axiosInstance.post("/posts", {
    title: post.title,
    content: post.content,
    isPublic: post.isPublic,
  });
  return res.data.post;
};


export const deletePost = async (post) => {
  await axiosInstance.delete(`/posts/${post._id}`);
};


export const updatePost = async (post, token) => {
  if (!post._id) throw new Error("Post ID is missing");

  const res = await axiosInstance.patch(
    `/posts/update/updatepost/${post._id}`,
    {
      title: post.title,
      content: post.content,
      isPublic: post.isPublic,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.post;
};


export const addComment = async (post, comment) => {
  const { commentContent , commentUser } = comment ;
  const res = await axiosInstance.post(`/posts/${post._id}/comments`, {
    commentContent ,
    commentUser
  });
  return res.data.post;
};


export const deleteComment = async (post, comment) => {
  const res = await axiosInstance.delete(
    `/posts/${post._id}/comments/${comment._id}`
  );
  return res.data.post;
};


export const updateLikes = async (postId, likedByUser) => {
  const res = await axiosInstance.patch(`/posts/${postId}/${likedByUser}`);
  return res.data.post;
};

export const getFeed = async ( username ) => {
  const res = await axiosInstance.get(`/posts/feed/${username}`);
  return res.data.feed ;
}
