var jwt = require('jsonwebtoken')

module.exports = {
    userTokenGenerator: function(user){
        return jwt.sign({
            id : user.id,
            name : user.name,
            firstname : user.firstname,
            email: user.email,
            image : user.image
        },
        process.env.JWT_SIGN,
        {
            expiresIn:'1h'
        })
    },
    parseAuthorization: function(authorization){
        return (authorization != null)? authorization.replace('Bearer ','') : null;
    },
    getUser: function(authorization){
        var userId = -1;
        var token  = module.exports.parseAuthorization(authorization);

        if(token != null){
            try {
                var jwtToken = jwt.verify(token, process.env.JWT_SIGN);
                if(jwtToken != null) userId = jwtToken.userId;
            } catch (err) {
                
            }
        }
        return userId;
    }
}