import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authMiddleware = async(req, res, next) => {
    try{
        const authHeader = req.header('Authorization');
        
        if(!authHeader){
            return res.status(401).json({
                success:false,
                message:"Access denied. No Authentication Token."
            })
        }
        
        const token = req.header('Authorization').replace('Bearer ', '');
        
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Access denied. No Authentication Token."
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.id).select('-password -refreshTokens');

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid Authentication Token."
            })
        }

        req.user = user;
        req.userId = user._id;

        next();

    }catch(error){
        console.log(error);

        if(error.name === 'JsonWebTokenError'){
            return res.status(401).json({
                success:false,
                message:"Invalid Authentication Token."
            })
        }

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success:false,
                message:"Authentication Token has expired."
            })
        }

        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}

export default authMiddleware;