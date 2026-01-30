const globalErrorHandling = (error, req, res, next)=>{
    console.error(typeof error.status);
    const status = error.status || 500;
    const category = error.category || 'SERVER';
    const message =  error.status === 500? 'Internal Server Error': error.message
    if (error.isJoi) {
        
        const statusCode = 400;
        return res.status(statusCode).json({
            success : false,
            status: statusCode,
            message : error.message.split(".")  
        });
    }
    
    res.status(status).json({
        success : false,
        category,
        message 
    });
};

module.exports = globalErrorHandling;