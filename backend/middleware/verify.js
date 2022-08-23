const jwt = require('jsonwebtoken');
const createError = require('../error');

const verifyToken = async (req, res, next) => {
    // console.log(req.cookies);
    const token = req.cookies.access_token
    if (!token) return next(createError(401, "Unauthorised Request"))

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Invalid Token!"))
        req.user = user;
        next()
    })
}

module.exports = verifyToken