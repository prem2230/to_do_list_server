export const handleMongoError = (error) => {
    if(error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        if(field === 'email') {
            return { status: 400, message: "Email already exists"};
        }
        if(field === 'username') {
            return { status: 400, message: "Username already exists"};
        }
        if(field === 'name') {
            return { status: 400, message: "Task already exists"}
        }
        return { status: 400, message: `Duplicate value for ${field} field`};
    }

    if(error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) =>  {
            if(err.kind === 'required') {
                return `${err.path} is required`;
            }
            if(err.kind === 'minlength') {
                return `${err.path} must be at least ${err.properties.minlength} characters`;
            }
            if(err.kind === 'maxlength') {
                return `${err.path} cannot exceed ${err.properties.maxlength} characters`;
            }
            if(err.kind === 'regexp' && err.path === 'email') {
                return "Please provide a valid email address";
            }
            if(err.kind === 'enum') {
                return `${err.path} must be one of: ${err.properties.enumValues.join(', ')}`;
            }
            return err.message;
        });
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