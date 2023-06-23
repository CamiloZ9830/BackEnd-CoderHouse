const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const userModel = require('../dao/modelsMongo/users.model');
const UserService = require('../services/user.service');
const UserDto = require('../dto/user.dto');
const { jwtKey, githubClientId, githubCallbackUrl, githubClientSecret, jwtCookieToken } = require('./dotenvVariables.config');


const userService = new UserService();

const cookieExtractor = (req, res) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[jwtCookieToken];
    }
    return token;
}

const initializePassport = (req) => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: jwtKey, 
    }, async (jwt_payload, done) => {
        try{
            return done(null, jwt_payload.user);
        }
        catch(e) {
            return done(e);
        }
    }));
    
/*estrategia third-party con github - registra un usuario y le asigna un carrito recien creado*/
passport.use('github', new GitHubStrategy({
    clientID: githubClientId,
    clientSecret: githubClientSecret,
    callbackURL: githubCallbackUrl,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await userModel.findOne({email: profile._json.email});
        if(!user) {
            const newUser = {
                lastName: profile.provider,
                userName: profile._json.login + "Github",
                email: profile._json.email,
            }
            const userDto = new UserDto(newUser);
            const dtoData = await userDto.githubDto();
            
                const registerUser = await userService.registerUser(dtoData);               
                return done(null, registerUser);

            } else {
                return done(null, user);
             }
            } catch (e) {
                return done(e.message);
            }
}));
   
}


module.exports = initializePassport;