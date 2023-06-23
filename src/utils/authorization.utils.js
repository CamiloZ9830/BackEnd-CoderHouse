const passport = require('passport');

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(error, user, info) {
            if (error) return next(error);
            if (!user) {
                return res.status(401).send({
                                            error: info.messages ? info.messages
                                            : info.toString()
                                             });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};

const handlePermissions = (permissions) => {
    return (req, res, next) => {
        const { role } = req.user;
        const upperCaseRole = role.toUpperCase();
        
        const hasPermission = permissions.includes(upperCaseRole);

        if (hasPermission) {
          next();
        } else {
          res.status(403).json({ error: 'Forbidden' });
        }
      };
};



module.exports = {
                    passportCall,
                    handlePermissions
                 };