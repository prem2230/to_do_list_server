import Task from "../models/task.model.js";
import { handleMongoError } from "../utils/index.js";

const addTask = async (req, res) => {
    try {
        const { name, completed } = req.body;

           if (name !== undefined && typeof name !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Task name must be a string"
            });
        }

        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "Completed field must be a boolean"
            });
        }

        const task = new Task({
            name: name?.trim(),
            completed: completed || false
        })
        await task.save();

        res.status(201).json({
            success: true,
            message: "Task added successfully",
            data: task
        })

    } catch (error) {
        const { status, message } = handleMongoError(error);
        res.status(status).json({
            success: false,
            message: message
        })
    }
}

const getTasks = async (req,res) =>{
    try{
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const search = req.query.search?.trim();
        
        page = Math.max(1, page);  // Minimum page = 1
        limit = Math.max(1, Math.min(100, limit));  // Limit between 1-100
        
        const skip = (page - 1) * limit;

        let query = {};
        if(search){
            query = {name: { $regex: search, $options: 'i' }}
        }

        const tasks = await Task.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await Task.countDocuments(query);

        if(tasks.length === 0){
            return res.status(404).json({
                success:false,
                message: search ? "No tasks found matching your search" : "No tasks found"
            })
        }

        res.status(200).json({
            success:true,
            message: search ? `Found ${tasks.length} tasks matching "${search}"` : "Tasks fetched successfully",
            data:tasks,
            count:tasks.length,
            searchQuery: search || null,
            pagination:{
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalTasks: total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
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
        const { status, message } = handleMongoError(error);
        res.status(status).json({
            success:false,
            message:message
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
        const { status, message } = handleMongoError(error);
        res.status(status).json({
            success:false,
            message:message
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
        const { status, message } = handleMongoError(error);
        res.status(status).json({
            success:false,
            message:message
        })
    }
}

export { addTask, getTasks, getTask, updateTask, deleteTask }