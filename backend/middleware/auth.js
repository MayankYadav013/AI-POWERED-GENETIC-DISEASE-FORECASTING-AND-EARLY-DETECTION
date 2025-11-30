const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
    const headerToken = req.header('x-auth-token');
    const bearerToken = req.header('authorization')?.split(' ')[1];
    const token = headerToken || bearerToken;

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};