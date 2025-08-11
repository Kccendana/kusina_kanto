const isAuthenticated = (req, res, next) => {
    if(req.session.user === undefined){
        return res.status(401).json('You do not have access.');
    }
    next();
};

function ensureRole(role) {
    return function (req, res, next) {
        if (req.isAuthenticated() && (req.user.role === role || req.user.role === "admin")) {
            return next();
        }
        res.status(403).json({ message: 'Forbidden - You do not have access' });
    };
}

module.exports = {
    isAuthenticated,
    ensureRole
}