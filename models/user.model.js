import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique:true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    username:{
        type:String,
        required: [true, 'Username is required'],
        unique:true,
        trim: true,
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 6 characters long']
    },
    refreshTokens:[{
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date
    }]
},{
    timestamps:true
});

const User = mongoose.model('User',userSchema);

export default User;