const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { getAge } = require('../utils')


router.post('/registration', passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res) => {
      res.status(200).send({status: "success", message: "User registered", url: "localhost:8080/login"});
       
});

router.get('/failregister', async (req, res) => {
    console.log("Failed Strategy");
    res.send({error: "Failed"});
});

router.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req, res) => {
    if(!req.user) return res.status(401).send({status: "error", error: "Invalid credentials"})
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userName: req.user.userName,
        role: req.user.role, 
        age: getAge(req.user.dateOfBirth),
        email: req.user.email
    }
    res.redirect('/products');
});

router.get('/faillogin', (req, res) => {
    res.send({error: "Failed Login"});
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.status(200).redirect('/login'); 
    });
});

router.get('/api/session/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {});

router.get('/api/session/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
    req.session.user = req.user;
    res.status(200).redirect('/products');
})

module.exports = router;