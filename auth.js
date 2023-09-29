const jwt = require('jsonwebtoken');


//authenticated middleware
exports.authenticateToken = (req, res, next)=>{
    const token = req.cookies.token;

    if(!token) {
        console.log('Not logged in') 
        return res.redirect('/')//unauthorized
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err){
            return res.redirect('/') //forbidden
        }

        req.user = user;
        console.log('Logged in..')
        next(); 
    });
};