const { Router } = require('express');
const { emailValidator, userNameValidator } = require('../middlewares/router.middlewares/router.middlewares');
const mongoDBUsersManager = require('../dao/mongoDB/mongoUsersManager');
const mongoDBCartsManager = require('../dao/mongoDB/mongoCartsManager');
const router = Router();
const passport = require('passport');
const { hashPassword, comparePasswords, generateToken } = require('../utils');

const mongoUsersManager = new mongoDBUsersManager();
const mongoCartsManager = new mongoDBCartsManager();

/*registra a un usuario usando la estrategia passport-jwt y le asigna un carrito recien creado */
router.post('/registration', userNameValidator, emailValidator, async (req, res) => {
    const {firstName, lastName, userName, email, dateOfBirth, password} = req.body;
        const user = {
            firstName,
            lastName,
            userName,
            email,
            dateOfBirth,
            password: hashPassword(password),
        }
        try {
            let saveUser = await mongoUsersManager.registerUser(user);
            /*const access_token = generateToken(user);
            console.log(access_token);*/
            if(saveUser) {
                try{
                    const createCart = await mongoCartsManager.addCart();
                     if(!createCart) return console.log("error creating cart");
                      saveUser["cartId"] = createCart;
                      const saveUserWithCartId = await mongoUsersManager.updateUserAttribute(saveUser._id, createCart._id);
                         if(!saveUserWithCartId) return console.log("could not assign a cartId to the new user");
                         res.status(201)./*cookie('jwtCookieToken', access_token, {
                            maxAge: 5*60*100,
                            httpOnly: true
                        }).*/send({status: "success", message: "User registered"})
                         return saveUserWithCartId;                  
                }
                catch(e) {
                    console.error(e.message);
                }

            }

            else {
                res.status(400).send({status: "error", message: "Could not save new user"}); 
            }
            
            return saveUser
        }
        catch(e) {
            console.error(e.message);
        }   
       
});


/*login de usuarios con la estrategia passport-jwt*/
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await mongoUsersManager.userLogIn(email);
        if(!user) return res.status(400).send({status: "error", error: "Invalid email"});
        if(!comparePasswords(password, user.password)) return res.status(400).send({status: "error", error: "Invalid password"});
        const access_token = generateToken(user);
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 5 * 60 * 1000,
            httpOnly: true
        }).redirect(`/products?access_token=${access_token}`);
    }
    catch(e) {
        console.error(e.message);
    } 
});


/*des-loguea un usuario de github o de jwt */
router.get('/logout', (req, res) => {
    if (req.isAuthenticated() && req.session.user.lastName === 'github'){
       
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
        });
    };
        res.clearCookie("jwtCookieToken");
        res.status(200).redirect('/login'); 
});

router.get('/api/session/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {});

router.get('/api/session/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
    req.session.user = req.user;
    res.status(200).redirect('/products');
});

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send(req.user);
});

module.exports = router;