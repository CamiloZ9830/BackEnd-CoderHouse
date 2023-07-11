const UserService = require('../services/user.service');
const UserDto = require('../dto/user.dto');
const { generateToken } = require('../utils/session.utils');
const { adminEmail, adminPassword, jwtCookieToken } = require('../config/dotenvVariables.config');
const { sendEmail } = require('../utils/mail.utils');

class UserController {
     constructor () {
         this.userService = new UserService();
     }

     registerUser = async (req, res) => {
        try {
            const userDto = new UserDto(req.body);
            const dtoData = await userDto.registrationDto();
            
            const saveUser = await this.userService.registerUser(dtoData);
            if(saveUser) {
                    sendEmail(dtoData.email); 
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
            req.logger.error(e.message);
            throw new Error(e.message);
        }   
     };

     userLogin = async (req, res) => {
        const { email, password } = req.body;

        try {
            let user = {};

            if (email === adminEmail) {
                
                if (password === adminPassword) {
                    user = {
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
                user = await this.userService.userLogIn(userCredentials);                          
            }
           
            const access_token = generateToken(user);
    
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

    gitHubLogin = async (req, res) => {
 
        const access_token = generateToken(req.user);

        res.cookie(jwtCookieToken, access_token, {
            maxAge: 30 * 60 * 1000,
            httpOnly: true
        }).status(200).redirect('/products');
    };


     userLogout = async (req, res) => { 
        try {
            res.clearCookie(jwtCookieToken);
            res.status(200).redirect('/login'); 
        } catch(e) {
            req.logger.error(e.message);
            res.status(400).send({status: "error", message: e.message});
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