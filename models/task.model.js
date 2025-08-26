import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Task name is required'],
        maxlength: [200, 'Task name cannot exceed 200 characters'],
        trim: true
    },
    completed:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

taskSchema.index({ createdAt: -1 });
taskSchema.index({ completed: 1 });
taskSchema.index({ name: 'text' });

const Task = mongoose.model('Task',taskSchema);
export default Task;