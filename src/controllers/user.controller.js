const UserService = require('../services/user.service');
const UserDto = require('../dto/user.dto');
const { generateToken, passwordUpdateToken, hashPassword, authenticateToken, comparePasswords } = require('../utils/session.utils');
const { adminEmail, adminPassword, jwtCookieToken, jwtKey, port } = require('../config/dotenvVariables.config');
const { sendEmail, sendRecoveryPassword } = require('../utils/mail.utils');



class UserController {
     constructor () {
         this.userService = new UserService();
         this.secret = null;
         this.user = null;
     }

     registerUser = async (req, res) => {
        try {
            const userDto = new UserDto(req.body);
            const dtoData = await userDto.registrationDto();
            
            const saveUser = await this.userService.registerUser(dtoData);
            if(saveUser) {
                    sendEmail(dtoData.email); 
                    req.logger.info(`new user registered succesfully`)
                    res.status(201)
                   .send({status: "success", message: "User registered, email sent"});              
            }

            else {
                req.logger.http(`
                HTTP Request:
                Method: ${req.method}
                URL: ${req.url}
                Headers: ${JSON.stringify(req.headers)}
                Body: ${JSON.stringify(req.body)}
                
                HTTP Response:
                Status Code: ${res.statusCode}
                Body: ${JSON.stringify(res.body)}
                
                Timestamp: ${new Date().toLocaleTimeString()}
                `);
                res.status(400).send({status: "error", message: "Could not save new user"}); 
            }
            
            return saveUser;
        }
        catch(e) {
            req.logger.error("something went wrong");
        }   
     };

     userLogin = async (req, res) => {
        const { email, password } = req.body;

        try {
            if (email === adminEmail) {
                
                if (password === adminPassword) {
                    this.user = {
                        userName: adminEmail,
                        role: "admin"
                    };
                } else {
                    req.logger.warning("Invalid admin credentials", e.message)
                    return res.status(400).send({ status: "error", error: "Invalid admin credentials" });
                }
            } else {              
                const userDto = new UserDto(req.body);
                const userCredentials = await userDto.dtoLogin();
                this.user = await this.userService.userLogIn(userCredentials);                  
            }
           
            const access_token = generateToken(this.user);
    
            res.cookie(jwtCookieToken, access_token, {
                maxAge: 30 * 60 * 1000,
                httpOnly: true
            }).status(200).redirect(`/products`);


        } catch (e) {
            req.logger.error(e.message);
            if (e.message === "Invalid email") return res.status(401).send({ status: "error", error: "Invalid email" });
            if (e.message === "Invalid password") return res.status(401).send({ status: "error", error: "Invalid password" });     
        }
    };

    userLoginPostman = async (req, res) => {
        const { email, password } = req.body;

        try {
            if (email === adminEmail) {
                
                if (password === adminPassword) {
                    this.user = {
                        userName: adminEmail,
                        role: "admin"
                    };
                } else {
                    req.logger.warning("Invalid admin credentials", e.message)
                    return res.status(400).send({ status: "error", error: "Invalid admin credentials" });
                }
            } else {
                
                const userDto = new UserDto(req.body);
                const userCredentials = await userDto.dtoLogin();
                this.user = await this.userService.userLogIn(userCredentials);                          
            }
           
            const access_token = generateToken(this.user);
    
            res.cookie(jwtCookieToken, access_token, {
                maxAge: 30 * 60 * 1000,
                httpOnly: true
            }).status(200).json({ status: "success", token: access_token });;


        } catch (e) {
            req.logger.error(e.message);
            if (e.message === "Invalid email") return res.status(401).send({ status: "error", error: "Invalid email" });
            if (e.message === "Invalid password") return res.status(401).send({ status: "error", error: "Invalid password" });     
        }
    };

    gitHubLogin = async (req, res) => {
 
        const access_token = generateToken(req.user);

        res.cookie(jwtCookieToken, access_token, {
            maxAge: 30 * 60 * 1000,
            httpOnly: true
        }).status(200).redirect('/api/products');
    };


     userLogout = async (req, res) => { 
        try {
            await this.userService.lastConnection(req.user._id);
            res.clearCookie(jwtCookieToken);
            res.status(200).redirect('/login');
        } catch(e) {
            req.logger.error(e.message);
            res.status(400).send({status: "error", message: e.message});
        }
     };

     /*
     envia el link con el id del user y un token curado/firmado,
     ? se valida si el correo pertence a un suario registrado
     ? si el token expira pierde validez y se genera un link que dirije a una nueva direccion donde se puede solicitar un nuevo link para cambiar la contraseña 
     */
     sendPasswordRecovery = async (req, res) => {
        const email = req.query.emailPasswordReset;
        const validateEmail = { email: email};
        try{
            this.user = await this.userService.fieldValidator(validateEmail);
            if(!this.user) return res.status(400).send({status: "error", message: "introduce a valid user"});
            this.secret = jwtKey + this.user.password;
            const access_token = passwordUpdateToken(this.user, this.secret);
            const url = `http://localhost:${port}/change/password/${this.user._id}/${access_token}`;
            req.logger.debug(this.user);
            const sendMail = sendRecoveryPassword(email, url);
            if(!access_token) return res.redirect('/login');
            res.status(201).send({status: "success", message: `${this.user.userName}, your password reset link was sent to your email address`});
            return sendMail;
        }catch(e){
            req.logger.error(e.message);
            res.status(400).send( { status: "error", message: e.message } );
        }
     };

     /*
     ? para la nueva contraseña se valida el token (si no ha expirado o se autentica correctamente)
     ? valida que la nueva contraseña que los campos sean iguales y no se actualize con la contraseña anterior 
     */ 
     passwordReset = async (req, res) => {
        const  { passwordReset1, passwordReset2 } = req.body;
        const { userId, token } = req.params;
        const expiredTokenLink = `http://localhost:${port}/password-reset`;
        try{
            const validToken = await authenticateToken(token, this.secret);
            if(!validToken) return res.status(400).send(`<p> Token expired or corrupted, please renew your token by clicking this <a href="${expiredTokenLink}">link</a></p>`);
            if(passwordReset1 !== passwordReset2) return res.status(400).send({status: "error", message: "The fields must match"});
            const isSamePassword = comparePasswords(passwordReset2, this.user.password);
            if(isSamePassword) return res.status(400).send({ status: "error", message: "New password must be different from the old password" });
            const newPassword = hashPassword(passwordReset2);
            const updatedPassword = await this.userService.updateUserAttribute(userId, "password", newPassword);
            if(!updatedPassword) return res.status(400).send({status: "error", message: "Could not change password, try again!"});
            res.status(200).send({status: "success", message: "Your password was succesfully updated"});
            return updatedPassword;
        }catch(e){
            req.logger.error(e.message);
            res.status(400).send( { status: "error", message: e.message } );
        }
     };

     /*
     cambia el rol de usuario de 'user' a 'premium' y viceversa
     !al cambiar el rol el req.user no se actualiza, asi que se genera un nuevo token y el req.user se actualiza con el nuevo rol y la session se mantiene
      */
     changeRole = async (req, res) => {
        const { _id, role, email, documentsStatus } = req.user;
        const { uid } = req.params;
        const validateEmail = { email: email};
        try{
            this.user = await this.userService.fieldValidator(validateEmail);
            if(this.user?.role === 'user' && this.user?.documentsStatus !== 'complete'){
                return res.status(409).json({status: "conflict", message: "Necesitas completar la documentacion para cambiar a premium"});
            }
            const changeRole = await this.userService.switchUserRole(_id, role);
            if(!changeRole) return res.status(400).send({status: "error", message: "There was an error. Try again!"});
            req.user["role"] = changeRole._doc.role;

            const access_token = generateToken(req.user);
            
        res.cookie(jwtCookieToken, access_token, {
            maxAge: 30 * 60 * 1000,
            httpOnly: true
        }).status(200).send({ status: "success", message: `Your user role was successfully updated, your role is now ${changeRole._doc.role}` });
            return changeRole;
        }catch(e){
            res.status(400).send( { status: "error", message: e.message } );
        }
     };

     deleteUser = async (req, res) => {
        const { uid } = req.params;
        try{
            const deleteUser = await this.userService.deleteUser("email", uid);
            res.status(200).send( { status: "success", payload: deleteUser });
            return deleteUser;
        }catch(e){
            req.logger.error(e.message);
            res.status(400).send( { status: "error", message: e.message } );
            throw (e);
        }
     };

    uploadUserDocuments = async (req, res) => {
        const { uid } = req.params;
        const { identificacion, domicilio, cuenta } = req.files;
        try{        
            if(identificacion){
                await this.userService.updateDocument(uid, identificacion[0].fieldname, identificacion[0].path);       
            }
            if(domicilio){
                await this.userService.updateDocument(uid, domicilio[0].fieldname, domicilio[0].path);                      
            }
            if(cuenta){
                await this.userService.updateDocument(uid, cuenta[0].fieldname, cuenta[0].path);
            }

           return res.status(201).json({ status: 'success', payload: req.files });
          
        }catch(e){
            res.status(400).send( { status: "error", message: e.message } );
        }
    };


     generateFakeUser = async (req, res) => {
        try{          
            const fakeUser = await this.userService.fakeUser();
            res.status(200).send({
                                  firstName: fakeUser.firstName,
                                  lastName: fakeUser.lastName,
                                  userName: fakeUser.userName,
                                  email: fakeUser.email,
                                  dateOfBirth: fakeUser.dateOfBirth,
                                  password: fakeUser.password,
                                  role: fakeUser.role
                                });
        } catch(e) {
            const requestInfo = `Request: ${req.method} in ${req.url}`;
            const user = req.user ? `User: ${req.user._id}` : 'User information not available';
            const timestamp = new Date().toLocaleTimeString();
            req.logger.info(`
                ${requestInfo}
                ${user}
                Timestamp: ${timestamp}
                `)
            res.status(500).json({message: `Error: ${e.message}`});
        }
     };

     loggerTest = async (req, res) => {
            try{
                const errorMessage = 'An unexpected error occurred during processing.';
                const requestInfo = `Request: ${req.method} in ${req.url}`;
                const user = req.user ? `User: ${req.user._id}` : 'User information not available';
                const timestamp = new Date().toLocaleTimeString();
                const warningMessage = 'A potential issue or warning was detected.';
                const requestMethod = req.method;
                const requestUrl = req.url;
                const requestHeaders = req.headers;
                const requestBody = req.body;
                const responseStatusCode = res.statusCode;
                const responseBody = res.body;

                req.logger.fatal(`
                ${errorMessage}
                ${requestInfo}
                ${user}
                Timestamp: ${timestamp}
                `);
                req.logger.error(`
                ${errorMessage}
                ${requestInfo}
                ${user}
                Timestamp: ${timestamp}
                `);
                req.logger.warning(`
                ${warningMessage}
                ${requestInfo}
                ${user}
                Timestamp: ${timestamp}
                `);
                req.logger.info(`
                ${requestInfo}
                ${user}
                Timestamp: ${timestamp}
                `);
                req.logger.http(`
                HTTP Request:
                Method: ${requestMethod}
                URL: ${requestUrl}
                Headers: ${JSON.stringify(requestHeaders)}
                Body: ${JSON.stringify(requestBody)}
                
                HTTP Response:
                Status Code: ${responseStatusCode}
                Body: ${JSON.stringify(responseBody)}
                
                Timestamp: ${timestamp}
                `);
                req.logger.debug(`${requestInfo}
                Timestamp: ${timestamp}`);

                res.status(200).send({ status: "success" });
                
            } catch(e){
                req.logger.error(e.message);
                throw new Error(e.message);
            }
     };
};


module.exports = UserController;