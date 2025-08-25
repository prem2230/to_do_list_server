import { handleMongoError } from "../../utils";

describe("handleMongoError", () => {    
    it("should handle ValidationError", () => {
        const error = {
            name: "ValidationError",
            errors: {
                name: { message: "Name is required" },
                completed: { message: "Completed must be a boolean" }
            }
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 400,
            message: "Name is required, Completed must be a boolean"
        });
    }); 
   it("should handle CastError for _id field", () => {
        const error = {
            name: "CastError",
            path: "_id",
            message: "Invalid ID"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 400,
            message: "Invalid ID format"
        });
    });
    it("should handle CastError for completed field", () => {
        const error = {
            name: "CastError",
            path: "completed",
            message: "Invalid boolean"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 400,
            message: "Completed field must be a boolean (true/false)"
        });
    });
    it("should handle CastError for other fields", () => {
        const error = {
            name: "CastError",
            path: "someField",
            message: "Invalid value"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 400,
            message: "Invalid value for someField field"
        });
    });
    it("should handle duplicate key error", () => {
        const error = {
            code: 11000,
            message: "Duplicate key error"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 400,
            message: "Task already exists"
        });
    });
    it("should handle MongoServerError for pagination", () => {
        const error = {
            name: "MongoServerError",
            message: "Error in skip value"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 400,
            message: "Invalid pagination parameters"
        });
    });  
    it("should handle skip message errors", () => {
        const error = {
            message: "skip value must be non-negative"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 400,
            message: "Invalid pagination parameters"
        });
    });   
    it("should handle MongoNetworkError", () => {
        const error = {
            name: "MongoNetworkError",
            message: "Failed to connect"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 503,
            message: "Database connection failed"
        });
    });
    it("should handle ECONNREFUSED error", () => {
        const error = {
            code: "ECONNREFUSED",
            message: "Connection refused"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 503,
            message: "Database connection failed"
        });
    });
    it("should handle MongoTimeoutError", () => {
        const error = {
            name: "MongoTimeoutError",
            message: "Connection timeout"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 503,
            message: "Database connection failed"
        });
    });
    it("should handle buffering timeout errors", () => {
        const error = {
            message: "buffering timed out after 10000ms"
        };
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 503,
            message: "Database connection failed"
        });
    });
    it("should handle other errors as fallback", () => {
        const error = new Error("Some unknown error");
        const result = handleMongoError(error);
        expect(result).toEqual({
            status: 500,
            message: "Internal server error"
        });
    });
});