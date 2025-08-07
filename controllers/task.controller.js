import Task from "../models/task.model.js";

const addTask = async (req, res) => {
    try {
        const { name, completed } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please provide a task name"
            })
        }
        const task = new Task({
            name,
            completed
        })
        await task.save();

        res.status(201).json({
            success: true,
            message: "Task added successfully",
            data: task
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getTasks = async (req,res) =>{
    try{
        const tasks = await Task.find();

        if(tasks.length === 0){
            return res.status(404).json({
                success:false,
                message:"No tasks found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Tasks fetched successfully",
            count:tasks.length,
            data:tasks
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const getTask = async(req,res) =>{
    try{
        const {id} = req.params;

        const task = await Task.findById(id);

        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Task retrieved successfully",
            data:task
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const updateTask = async(req,res) =>{
    try{
        const { id } = req.params;
        const { name, completed } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, { name, completed }, { new: true });
        if(!updatedTask){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Task updated successfully",
            data:updatedTask
        })
        
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

const deleteTask = async(req,res) =>{
    try{
        const { id } = req.params;
        
        const deletedTask = await Task.findByIdAndDelete(id);
        if(!deletedTask){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: deletedTask
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export { addTask, getTasks, getTask, updateTask, deleteTask }