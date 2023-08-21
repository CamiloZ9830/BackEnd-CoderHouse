const { Router } = require('express');
const { emailValidator, userNameValidator } = require('../middlewares/router.middlewares/router.middlewares');
const UserController = require('../controllers/user.controller');
const router = Router();
const passport = require('passport');
const { passportCall } = require('../utils/authorization.utils');
const uploads = require('../utils/multer.utils');



const userController = new UserController();

/*registra a un usuario usando la estrategia passport-jwt y le asigna un carrito recien creado */
router.post('/registration',emailValidator, userNameValidator, userController.registerUser);

/*artillery user test*/
router.get('/userFlowTest', userController.generateFakeUser);

/*loggerTest*/
router.get('/loggerTest', userController.loggerTest);

/*login de usuarios (render) con la estrategia passport-jwt*/
router.post('/login', userController.userLogin);

/*login postman*/
router.post('/user-login', userController.userLoginPostman);

/*des-loguea un usuario de github o de jwt */
router.get('/logout', passportCall('jwt'), userController.userLogout);

/*recuperacion de contraseña*/
router.get('/email/password-reset', userController.sendPasswordRecovery);
router.post('/restore/password/:userId/:token', userController.passwordReset);

/*subir documentacion*/
router.post('/api/users/:uid/documents', passportCall('jwt'), uploads, userController.uploadUserDocuments);

/*cambiar rol*/
router.post('/api/users/premium/:uid/', passportCall('jwt'), userController.changeRole);

/*elimina el usuario*/
router.delete('/user-delete/:uid', userController.deleteUser);

/*github login*/
router.get('/api/session/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {});

router.get('/api/session/githubcallback', passport.authenticate('github', {session: false, failureRedirect: '/login'}), userController.gitHubLogin);

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send(req.user);
});

module.exports = router;