import User from "../models/User.js";


const updateProgress = async (req, res) => {
  try {
    const { scoreChange, newLevel } = req.body;
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    
    if (typeof scoreChange === "number") {
      user.gameScore += scoreChange;
    }
    if (typeof newLevel === "number" && newLevel > user.level) {
      user.level = newLevel;
    }

    await user.save();
    return res.status(200).json({
      msg: "Progress updated successfully",
      level: user.level,
      gameScore: user.gameScore,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({}, "username gameScore level")
      .sort({ gameScore: -1 })
      .limit(10);

    return res.status(200).json({ topUsers });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export { updateProgress, getLeaderboard };
