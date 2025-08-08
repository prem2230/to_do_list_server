export const handleMongoError = (error) => {
    if(error.code === 11000) {
        return { status: 400, message: "Task already exists"}
    }

    if(error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return { status: 400, message: errors.join(", ")};
    }

   if(error.name === "CastError") {
        if(error.path === '_id') {
            return { status: 400, message: "Invalid ID format"};
        }
        
        if(error.path === 'completed') {
            return { status: 400, message: "Completed field must be a boolean (true/false)"};
        }
        
        return { status: 400, message: `Invalid value for ${error.path} field`};
    }

    if(error.name === 'MongoServerError' || (error.message && error.message.includes('skip'))) {
        return { status: 400, message: "Invalid pagination parameters" };
    }

   if(error.name === 'MongoNetworkError' || 
       error.name === 'MongoServerError' ||
       error.name === 'MongoTimeoutError' ||
       error.code === 'ENOTFOUND' ||
       error.code === 'ECONNREFUSED' ||
       error.message.includes('buffering timed out') ||
       error.message.includes('connection') ||
       error.message.includes('timeout')) {
        return { status: 503, message: "Database connection failed" };
    }

    return { status: 500, message: "Internal server error"};
}