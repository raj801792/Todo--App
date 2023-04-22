const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req,res,next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');

    //if token are not present
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }

    try {
        // verify a token
        const data = jwt.verify(token, JWT_SECRET);
        //if token are currect then get user details and send it in req.user
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    
}

module.exports = authenticate;