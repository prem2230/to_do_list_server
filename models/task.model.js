import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Task title is required'],
        maxlength: [200, 'Task title cannot exceed 200 characters']
    },
    description:{
        type:String,
        maxlength: [1000, 'Task description cannot exceed 1000 characters'],
        required: [true, 'Task description is required']
    },
    completed:{
        type:Boolean,
        default:false
    },
    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium',
        required: [true, 'Task priority is required']
    },
    dueDate:{
        type:Date,
        required: [true, 'Task due date is required']
    }
},
{
    timestamps:true
});

taskSchema.index({ createdAt: -1 });
taskSchema.index({ completed: 1 });
taskSchema.index({ title: 'text' });

const Task = mongoose.model('Task',taskSchema);
export default Task;