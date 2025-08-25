import * as taskController from "../../controllers/task.controller";
import taskModel from '../../models/task.model';
import httpMocks from 'node-mocks-http';
import newTask from '../mock/newTask.json';
import allTasks from '../mock/allTasks.json';

taskModel.find = jest.fn();
taskModel.findById = jest.fn();
taskModel.countDocuments = jest.fn();
taskModel.prototype.save = jest.fn();   
taskModel.findByIdAndUpdate = jest.fn();
taskModel.findByIdAndDelete = jest.fn();

let req, res, next, pagination;

const taskId = "68abf2ff346d5757decc0bcd";

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("TaskController.addTask", () => {
    beforeEach(() => {
        req.body = newTask;
    }); 
    it("should call TaskModel.create", async () => {
        const mockSave =  jest.fn().mockResolvedValue(newTask);
        taskModel.prototype.save = mockSave;
        await taskController.addTask(req,res,next);
        expect(mockSave).toHaveBeenCalled();
    });
    it("should return 400 when name is not string", async () => {
        req.body = { name: 12345, completed: false };
        await taskController.addTask(req,res,next);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({
            success: false,
            message: "Task name must be a string"
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return 400 when completed is not boolean", async () => {
        req.body = { name: "Task 1", completed: "not boolean" };
        await taskController.addTask(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({
            success: false,
            message: "Completed field must be a boolean"
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return 201 response code and json body in response", async () => {
        taskModel.prototype.save.mockResolvedValue(newTask);
        await taskController.addTask(req,res,next);
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual({
        success: true,
        message: "Task added successfully",
        data: expect.objectContaining({
            name: newTask.name,
            completed: newTask.completed,
            _id: expect.any(String)
        })
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
   it("should handle errors", async () => {
        const errorMessage = { message: "Name property missing" };
        const rejectedPromise = Promise.reject(errorMessage);    
        taskModel.prototype.save.mockReturnValue(rejectedPromise);
        await taskController.addTask(req, res, next);
        expect(res._getJSONData()).toMatchObject({
            success: false,
            message: expect.any(String)
        });
        expect(next).not.toHaveBeenCalled(); 
    });
});

describe("TaskController.getTasks", () => {
    beforeEach(() => {
     pagination = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(allTasks)
        };
    });
    it("should handle pagination parameters", async () => {
        req.query = { page: 1, limit: 10 };
        taskModel.find = jest.fn().mockReturnValue(pagination);
        taskModel.countDocuments.mockResolvedValue(2);
        await taskController.getTasks(req, res, next);
        expect(taskModel.find).toHaveBeenCalled();
        expect(pagination.skip).toHaveBeenCalledWith(0);
        expect(pagination.limit).toHaveBeenCalledWith(10);
        expect(pagination.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
    it("should handle search query", async () => {
        req.query = { search: "Task 1" };
        taskModel.find = jest.fn().mockReturnValue(pagination);
        taskModel.countDocuments.mockResolvedValue(1);
        await taskController.getTasks(req, res, next);
        expect(taskModel.find).toHaveBeenCalledWith({ name: { $regex: "Task 1", $options: 'i' } });
    });
    it("should call TaskModel.find", async () => {
        taskModel.find = jest.fn().mockReturnValue(pagination);
        taskModel.countDocuments.mockResolvedValue(2);
        await taskController.getTasks(req,res,next);
        expect(taskModel.find).toHaveBeenCalled();
        expect(pagination.skip).toHaveBeenCalled();
        expect(pagination.limit).toHaveBeenCalled();
        expect(pagination.sort).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return 200 response code and json body in response", async () => {
        taskModel.find = jest.fn().mockReturnValue(pagination);
        taskModel.countDocuments = jest.fn().mockResolvedValue(2);
        await taskController.getTasks(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({
            success: true,
            message: "Tasks fetched successfully",
            data: allTasks,
            count: 2,
            pagination:{
                currentPage: 1,
                hasNext: false,
                hasPrev: false,
                totalPages: 1,
                totalTasks: 2
            },
            searchQuery: null
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
    it("should return 404 when no tasks found", async () => {
        pagination = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue([]) // Return empty array, not null
        };
        taskModel.find = jest.fn().mockReturnValue(pagination);
        taskModel.countDocuments.mockResolvedValue(0);
        await taskController.getTasks(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual({
            success: false,
            message: "No tasks found"
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
    it("should handle errors", async () => {
          const errorMessage = { message: "Error finding tasks" };
          const rejectedPromise = Promise.reject(errorMessage);    
          taskModel.find = jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnValue(rejectedPromise)
          });
          taskModel.countDocuments = jest.fn();
          await taskController.getTasks(req, res, next);
          expect(res._getJSONData()).toMatchObject({
                success: false,
                message: expect.any(String)
          });
          expect(next).not.toHaveBeenCalled(); 
     });
});

describe("TaskController.getTask", () => {
    it("should call TaskModel.findById", async () => {
        req.params.id = taskId;
        taskModel.findById.mockResolvedValue(newTask);
        await taskController.getTask(req,res,next);
        expect(taskModel.findById).toHaveBeenCalledWith(taskId);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return 200 response code and json body in response", async () => {
        req.params.id = taskId;
        taskModel.findById.mockResolvedValue(newTask);
        await taskController.getTask(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({
            success: true,
            message: "Task retrieved successfully",
            data: expect.objectContaining({
                name: newTask.name,
                completed: newTask.completed,
            })
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
    it("should return 404 when task not found", async () => {
        req.params.id = taskId;
        taskModel.findById.mockResolvedValue(null); // Simulate not found
        await taskController.getTask(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual({
            success: false,
            message: "Task not found"
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
    it("should handle errors", async () => {
          const errorMessage = { message: "Error finding task" };
          const rejectedPromise = Promise.reject(errorMessage);    
          taskModel.findById.mockReturnValue(rejectedPromise);
          await taskController.getTask(req, res, next);
          expect(res._getJSONData()).toMatchObject({
                success: false,
                message: expect.any(String)
          });
          expect(next).not.toHaveBeenCalled(); 
     });
});

describe("TaskController.updateTask", () => {
    it("should call TaskModel.findByIdAndUpdate", async () => { 
        req.params.id = taskId;
        req.body = { name: "Updated Task", completed: true };
        taskModel.findByIdAndUpdate.mockResolvedValue({...newTask, ...req.body});
        await taskController.updateTask(req,res,next);
        expect(taskModel.findByIdAndUpdate).toHaveBeenCalledWith(taskId, req.body, { new: true });
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return 200 response code and json body in response", async () => {
        req.params.id = taskId;
        req.body = { name: "Updated Task", completed: true };
        taskModel.findByIdAndUpdate.mockResolvedValue({...newTask, ...req.body});
        await taskController.updateTask(req,res,next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({  
            success: true,
            message: "Task updated successfully",
            data: expect.objectContaining({
                name: "Updated Task",
                completed: true
            })
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
    it("should return 404 when task to update not found", async () => {
        req.params.id = taskId;
        req.body = { name: "Updated Task", completed: true };
        taskModel.findByIdAndUpdate.mockResolvedValue(null); // Simulate not found
        await taskController.updateTask(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual({
            success: false,
            message: "Task not found"
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
    it("should handle errors", async () => {
          const errorMessage = { message: "Error updating task" };
          const rejectedPromise = Promise.reject(errorMessage);
          taskModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
          await taskController.updateTask(req, res, next);
          expect(res._getJSONData()).toMatchObject({
                success: false,
                message: expect.any(String)
          });
          expect(next).not.toHaveBeenCalled();
     });
});

describe("TaskController.deleteTask", () => {
    it("should call TaskModel.findByIdAndDelete", async () => { 
        req.params.id = taskId;
        taskModel.findByIdAndDelete.mockResolvedValue(newTask);
        await taskController.deleteTask(req,res,next);
        expect(taskModel.findByIdAndDelete).toHaveBeenCalledWith(taskId);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return 200 response code and json body in response", async () => {
        req.params.id = taskId;
        taskModel.findByIdAndDelete.mockResolvedValue(newTask);
        await taskController.deleteTask(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({
            success: true,
            message: "Task deleted successfully",
            data: expect.objectContaining({
                name: newTask.name,
                completed: newTask.completed,
            })
        });
        expect(res._isEndCalled()).toBeTruthy();
    });
    it("should return 404 when task to delete not found", async () => {
        req.params.id = taskId;
        taskModel.findByIdAndDelete.mockResolvedValue(null); // Simulate not found
        await taskController.deleteTask(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual({
            success: false,
            message: "Task not found"
        });
        expect(res._isEndCalled()).toBeTruthy();       
    });
    it("should handle errors", async () => {
          const errorMessage = { message: "Error deleting task" };
          const rejectedPromise = Promise.reject(errorMessage);
          taskModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
          await taskController.deleteTask(req, res, next);
          expect(res._getJSONData()).toMatchObject({
                success: false,
                message: expect.any(String)
          });
          expect(next).not.toHaveBeenCalled();
     });
});