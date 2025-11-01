
import User from "../models/User.js";

const getUser = async (req , res) => {

    try{
        const { username } = req.params ;
        
        const user = await User.findOne({username}).select("-password");

        if ( !user ) return res.status(404).json({msg : "User not found"});

        return res.status(200).json({user});
    }
    catch( err ){
        return res.status(500).json({error : err.message});
    }

}



const toggleFollow = async (req, res) => {
  try {
    const { usernameToToggle } = req.body; 
    const currUsername = req.user.username; 

    if (currUsername === usernameToToggle)
      return res.status(400).json({ msg: "You cannot follow yourself" });

    const currUser = await User.findOne({ username: currUsername });
    const otherUser = await User.findOne({ username: usernameToToggle });

    if (!otherUser)
      return res.status(404).json({ msg: "User not found" });

    const isFollowing = currUser.following.some(
      (u) => u.username === usernameToToggle
    );

    if (isFollowing) {
      
      currUser.following = currUser.following.filter(
        (u) => u.username !== usernameToToggle
      );
      otherUser.followers = otherUser.followers.filter(
        (u) => u.username !== currUsername
      );

      await Promise.all([currUser.save(), otherUser.save()]);

      return res.status(200).json({
        msg: "Unfollowed successfully",
        following: false,
      });
    } else {
      
      currUser.following.push({ username: usernameToToggle });
      otherUser.followers.push({ username: currUsername });

      await Promise.all([currUser.save(), otherUser.save()]);

      return res.status(200).json({
        msg: "Followed successfully",
        following: true,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




export { getUser , toggleFollow } ;