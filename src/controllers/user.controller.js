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
                res.status(400).send({status: "error", message: "Could not save new user"}); 
            }
            
            return saveUser;
        }
        catch(e) {
            console.error(e.message);
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
            console.error(e.message);
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
        res.clearCookie(jwtCookieToken);
        res.status(200).redirect('/login'); 
     };


};


module.exports = UserController;