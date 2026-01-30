const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    const authHeader = req.headers.authorization
    console.log('Auth header'+authHeader)
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    // console.log('Secret' + process.env.JWT_SECRET)
    const token = authHeader.split(' ')[1];
    console.log('Token '+ token)
    jwt.verify(token, process.env.JWT_SECRET,(error, decoded) => {
        if (error) {
            if(error.name === 'TokenExpiredError'){
                console.log(error.name ,error.message)
                return res.status(401).json({ message: 'token expired, Login again'})
            }else if(error.name === 'JsonWebTokenError'){
                return res.status(403).json({ message: 'Token Invalid' })
            }
        }
        req.user = decoded;
        next();
    });
}

module.exports = {verifyToken}