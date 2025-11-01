import express from 'express'

import { getUser , toggleFollow } from '../controllers/userController.js'

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users/:username' , authMiddleware , getUser );

router.patch('/users/follow' , authMiddleware , toggleFollow);

export { router };