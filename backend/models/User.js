import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: [{ username: { type: String, required: true } }],
    following: [{ username: { type: String, required: true } }],
    level: { type: Number, default: 1 },        
    gameScore: { type: Number, default: 0 },    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
