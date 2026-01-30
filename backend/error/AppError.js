class AppError extends Error{
    constructor(status, category, message){
        super(message);
        this.status = status;
        this.category = category;
    }
}

module.exports = AppError