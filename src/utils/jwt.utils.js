var jwt = require('jsonwebtoken')
const JWT_SIGN_SECRET ='2sdfsfsg7x9f4xc5v5sdf5sdfgfdgxc6v9c8g7rx9gtye99kqdjf9ffg6fg56VK6x91gdgPR'

module.exports = {
    userTokenGenerator: function(user){
        return jwt.sign({
            id : user.id,
            username : user.username
        },
        JWT_SIGN_SECRET,
        {
            expiresIn:'1h'
        })
    },
    parseAuthorization: function(authorization){
        return (authorization != null)? authorization.replace('Bearer ','') : null;
    },
    getUserId: function(authorization){
        var userId = -1;
        var token  = module.exports.parseAuthorization(authorization);

        if(token != null){
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if(jwtToken != null) userId = jwtToken.userId;
            } catch (err) {
                
            }
        }
        return userId;
    }
}