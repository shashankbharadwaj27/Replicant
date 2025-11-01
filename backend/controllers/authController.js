
import User from "../models/User.js";

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import dotenv from'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET_KEY ;


const signup = async (req , res) => {

    try{

    const { username , password } = req.body ;

    const exists = await User.findOne({username});

    if (exists) return res.status(200).json({msg : "username already exists"});

    const hashed = await bcrypt.hash(password , 10)

    const user = await User.create({username , password : hashed});

    const token = jwt.sign({username : user.username , userId : user._id} , secret , {
        expiresIn : '7d'
    })

    return res.status(201).json({msg : "user creted successfully" , username , token});

    }

    catch (err) { return res.status(500).json({error : err.message}); }

}

const login = async (req , res) => {

    try{
        const { username , password } = req.body ;

        const exists = await User.findOne({username});

        if ( !exists ) return res.status(400).json({msg : "username doesn't exist"});

        const match = await bcrypt.compare( password , exists.password );

        if ( !match ) return res.status(400).json({msg : "incorrect password"});

        const token = jwt.sign({username : exists.username , userId : exists._id} , secret , {
            expiresIn : "7d"
        })

        return res.status(200).json({msg : "login successful" , token , username : exists.username});
    }
    catch (err) { return res.status(500).json({error : err.message}); }

}

export { signup , login } ;