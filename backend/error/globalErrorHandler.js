const globalErrorHandling = (error, req, res, next)=>{
    console.error(typeof error.status);
    const status = error.status || 500;
    const category = error.category || 'SERVER';
    const message =  error.status === 500? 'Internal Server Error': error.message
    if (error.isJoi) {
        // converting error messages as key-value pairs
        const message = error.details.reduce((msgs, err) =>{
            msgs[err.context.key] = err.message;
            return msgs;
        }, {});
        const statusCode = 400;
        return res.status(statusCode).json({
            success : false,
            status: statusCode,
            message : message  
        });
    }
    console.log(error.message)
    res.status(status).json({
        success : false,
        category,
        message 
    });
};

module.exports = globalErrorHandling;