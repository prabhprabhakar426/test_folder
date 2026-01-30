const authorizeRole = (...allowedRole)=> {
    return (req, res, next)=>{
        
            if(!allowedRole.includes(req.user.role)){
                res.status(403).json({message: "Access Denied"})
            }
            console.log('Access Granted')
            next();
    }
}

module.exports = {authorizeRole}