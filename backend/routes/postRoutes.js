import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { 
  addComment, 
  createPost, 
  deleteComment, 
  deletePost, 
  changestatus, 
  updateLikes, 
  getPosts ,
  updatePost,
  getFeed,
  getPost
} from '../controllers/postController.js';

const router = express.Router();

router.post('/posts', authMiddleware, createPost);
router.get('/posts/id/:postId' , authMiddleware , getPost);
router.patch('/posts/:postId/:likedByUser', authMiddleware, updateLikes);
router.patch('/posts/:postId/status', authMiddleware, changestatus);
router.patch('/posts/update/updatepost/:postId', authMiddleware, updatePost);
router.post('/posts/:postId/comments', authMiddleware, addComment);
router.delete('/posts/:postId/comments/:commentId', authMiddleware, deleteComment);
router.delete('/posts/:postId', authMiddleware, deletePost);
router.get('/posts/:username', authMiddleware, getPosts);
router.get('/posts/feed/:username' , authMiddleware , getFeed);

export { router };
