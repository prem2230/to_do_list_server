import User from "../models/user.model.js";
import { handleMongoError } from "../utils/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try{
        const { username, email, password, confirmPassword } = req.body;

        if(!password || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Please provide password and confirm password"
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword
         });
        await newUser.save();

        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:{
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    }catch(error){
        const { status, message } = handleMongoError(error);
        res.status(status).json({
            success:false,
            message:message
        })
    }
}

const loginUser = async (req, res) => {
    try{
        const { email, username, password } = req.body;

        const loginCredential = email || username;

        if(!loginCredential || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide email/username and password"
            });
        }

        let query = {};
        let credentialType = '';    
        if(email){
            query.email = email;
            credentialType = 'email';
        } 
        if(username){
            query.username = username;
            credentialType = 'username';
        }

        const user = await User.findOne(query);

        if(!user){
            let errorMessage = '';
            switch(credentialType){
                case 'email':
                    errorMessage = 'Email not found';
                    break;
                case 'username':
                    errorMessage = 'Username not found';
                    break;
                default:
                    errorMessage = 'User not found';
            }
            return res.status(404).json({
                success:false,
                message:errorMessage
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                success:false,
                message:"Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email
            },
            process.env.SECRET_KEY,
            { expiresIn: '20s' }
        );

        const refreshToken = jwt.sign(
            {
                id: user._id,
                username: user.username,
                type : 'refresh'
            },
            process.env.REFRESH_KEY,
            { expiresIn: '40s' }
        );

        user.refreshTokens.push({
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000) // 7 days
        });
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Login successful",
            token:token,
            refreshToken: refreshToken,
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    }catch(error){
        console.log(error)
        const { status, message } = handleMongoError(error);
        res.status(status).json({
            success:false,
            message:message
        });
    }
}

const getUser = async( req, res) => {
    try{
        const user = req.user;

        res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    }catch(error){
        const { status, message } = handleMongoError(error);
        res.status(status).json({
            success:false,
            message:message
        });

    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
        const user = await User.findById(decoded.id);
        
        if (!user || !user.refreshTokens.some(rt => rt.token === refreshToken)) {
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        const newToken = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: '10s' }
        );

        res.status(200).json({
            success: true,
            token: newToken
        });

    } catch (error) {
        res.status(403).json({
            success: false,
            message: "Invalid refresh token"
        });
    }
}

export { registerUser, loginUser, getUser, refreshToken };