import Task from "../../models/task.model";

describe("Task Model", () => {
    it("should validate required fields", async () => {
        const task = new Task({});
        let err;
        try {
            await task.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.name).toBeDefined();
    });   
    it("should validate maxLength for name field", async () => {
        const longName = 'a'.repeat(201);
        const task = new Task({ name: longName });
        let err;
        try {
            await task.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.name).toBeDefined();
        expect(err.errors.name.message).toBe("Task name cannot exceed 200 characters");
    });
    it("shpuld create task with valid data", async () => {
        const taskData = { name: "Test Task", completed: false };
        const task = new Task(taskData);
        expect(task.name).toBe(taskData.name);
        expect(task.completed).toBe(taskData.completed);
    });
    it("should set completed to false by default", async () => {
        const task = new Task({ name: "Test Task" });
        expect(task.completed).toBe(false);
    });
    it("should trim whitespace from name field", async () => {
        const task = new Task({ name: "   Test Task   " });
        expect(task.name).toBe("Test Task");
    });
    it("should accept vallid completed values", async () => {
        const task1 = new Task({ name: "Task 1", completed: true });
        const task2 = new Task({ name: "Task 2", completed: false });
        expect(task1.completed).toBe(true);
        expect(task2.completed).toBe(false);
    });
    it("should have timestamps", async () => {
        const task = new Task({ name: "Test Task" });
        expect(task.schema.paths.createdAt).toBeDefined();
        expect(task.schema.paths.updatedAt).toBeDefined();
    });
    it("should validate empty string name", async () => {
        const task = new Task({ name: "" });
        let err;
        try {
            await task.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.name).toBeDefined();
    })
})