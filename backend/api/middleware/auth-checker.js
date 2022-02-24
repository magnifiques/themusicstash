const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
      }

      try {

        
        const Token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!Token) {
          return res.status(404).json({
              message: 'Token not found',
              status: false
          });
        }
        const decodedToken = jwt.verify(Token, process.env.JWT_KEY);
   
        req.userData = { userId: decodedToken.userId };
        next();
      } catch (error) {
            res.status(500).json({
            message: error.message,
            status: false
        })
      }
    

}

module.exports = checkAuth