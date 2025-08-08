export const handleMongoError = (error) => {
    if(error.code === 11000) {
        return { status: 400, message: "Task already exists"}
    }

    if(error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return { status: 400, message: errors.join(", ")};
    }

    if(error.name === "CastError") {
        return { status: 400, message: "Invalid ID"};
    }

    if(error.name === 'MongoNetworkError') {
        return { status: 503, message: "MongoDB connection error" };
    }

    return { status: 500, message: "Internal server error"};
}