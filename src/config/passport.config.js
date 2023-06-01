const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const userModel = require('../dao/models/users.model');
const mongoDBUsersManager = require('../dao/mongoDB/mongoUsersManager');
const mongoDBCartsManager = require('../dao/mongoDB/mongoCartsManager');

const mongoUsersManager = new mongoDBUsersManager();
const mongoCartsManager = new mongoDBCartsManager();


const cookieExtractor = (req, res) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken'];
    }
    return token;
}

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "JWTPrivateKey", 
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
        clientID: "Iv1.a6e63202869f51d6",
        clientSecret: "83487f6290173fa3e35cc57aa85977368ade7279",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            const user = await userModel.findOne({email: profile._json.email});
            if(!user) {
                const newUser = {
                    firstName: ' ',
                    lastName: profile.provider,
                    userName: profile._json.login + "Github",
                    age: ' ',
                    email: profile._json.email,
                    password: ' ',
                }
                let result = await userModel.create(newUser);
                if(result) {
                    try{
                        const createCart = await mongoCartsManager.addCart();
                         if(!createCart) return console.log("error creating cart");
                          result["cartId"] = createCart;
                          const saveUserWithCartId = await mongoUsersManager.updateUserAttribute(result._id, createCart._id);
                             if(!saveUserWithCartId) return console.log("could not assign a cartId to the new user");
                                               
                             return done(null, saveUserWithCartId);
                    }
                    catch(e) {
                        console.error(e.message);
                    }
    
                }
            }
            else {
                return done(null, user);
             }
        }
        catch (e) {
            return done(e.message);
        }
    }));



    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });

   
}


module.exports = initializePassport;