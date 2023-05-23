const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const userModel = require('../dao/models/users.model');
const { hashPassword, comparePasswords } = require('../utils');

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, async (req, username, password, done) => {
            const {firstName, lastName, userName, dateOfBirth, email} = req.body;
            try{
            const userEmailV = await userModel.findOne({email: username}).select("email");
            const userNameV = await userModel.findOne({userName: userName.toLowerCase()}).select("userName");
            console.log(userEmailV, userNameV);
            if(userEmailV?.email === username) {
                console.log("Email already exists");
                return done(null, false);
                
            }
            if(userNameV?.userName === userName.toLowerCase()) {
                console.log("User name already exists");
                return done(null, false);
            }
                
                    const newUser = {
                    firstName,
                    lastName,
                    userName,
                    dateOfBirth,
                    email,
                    password: hashPassword(password)
                }
                const result = await userModel.create(newUser);
                return done(null, result);
            
            }
            catch(e) {
                   return done("Error getting user: " + e.message);
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.a6e63202869f51d6",
        clientSecret: "83487f6290173fa3e35cc57aa85977368ade7279",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            console.log("github profile: ", profile,"github username :", profile.username);
            const user = await userModel.findOne({email: profile._json.email});
            if(!user) {
                const newUser = {
                    firstName: ' ',
                    lastName: ' ',
                    userName: profile._json.login + "Github",
                    age: ' ',
                    email: profile._json.email,
                    password: ' ',
                }
                const result = await userModel.create(newUser);
                return done(null, result);
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

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username, password, done) => {
        try{
            const user = await userModel.findOne({email: username});
            if(!user) {
                console.log("User doesn't exist");
                return done(null, false);
            }
            if(!comparePasswords(password, user.password)) return done (null, false);
            return done(null, user);
        }

        catch (e) {
            return done(e.message);
        }
    }));
}


module.exports = initializePassport;