
import express from 'express' ;

import { router as authRouter } from './routes/authRoutes.js';

import { router as userRouter } from './routes/userRoutes.js';

import { router as postRouter } from './routes/postRoutes.js';

import { router as gameRouter } from './routes/gameRoutes.js';

import mongoose from 'mongoose'

import dotenv from 'dotenv'

import cors from 'cors'



dotenv.config();

const app = express();

app.use(cors());

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use(express.json());

app.use('/api', authRouter);

app.use('/api',  userRouter);

app.use('/api',  postRouter);

app.use('/api' , gameRouter);

app.get("/", (req, res) => res.send("Server is running"));

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});