
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET_KEY  ; 

const authMiddleware = (req, res, next) => {
  try {
    
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export {authMiddleware};
