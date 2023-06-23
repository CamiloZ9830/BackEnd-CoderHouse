const { Router } = require('express');
const { emailValidator, userNameValidator } = require('../middlewares/router.middlewares/router.middlewares');
const UserController = require('../controllers/user.controller');
const router = Router();
const passport = require('passport');


const userController = new UserController();

/*registra a un usuario usando la estrategia passport-jwt y le asigna un carrito recien creado */
router.post('/registration', userNameValidator, emailValidator, userController.registerUser);


/*login de usuarios con la estrategia passport-jwt*/
router.post('/login', userController.userLogin);

/*des-loguea un usuario de github o de jwt */
router.get('/logout', userController.userLogout);

router.get('/api/session/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {});

router.get('/api/session/githubcallback', passport.authenticate('github', {session: false, failureRedirect: '/login'}), userController.gitHubLogin);

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send(req.user);
});

module.exports = router;