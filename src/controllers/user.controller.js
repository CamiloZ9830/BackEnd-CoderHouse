const UserService = require('../services/user.service');
const { hashPassword, comparePasswords, generateToken } = require('../utils');
const { adminEmail, adminPassword } = require('../config/dotenvVariables.config');

class UserController {
     constructor () {
         this.userService = new UserService();
     }

     registerUser = async (req, res) => {
        const { firstName, lastName, userName, email, dateOfBirth, password } = req.body;
        const user = {
            firstName,
            lastName,
            userName,
            email,
            dateOfBirth,
            password: hashPassword(password),
        }
        try {
            const saveUser = await this.userService.registerUser(user);
            if(saveUser) {
                   res.status(201)
                   .send({status: "success", message: "User registered"});              
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
                        role: "SuperAdmin"
                    };
                } else {
                    return res.status(400).send({ status: "error", error: "Invalid admin credentials" });
                }
            } else {
                
                user = await this.userService.userLogIn(email);
    
                if (!user) {
                    return res.status(400).send({ status: "error", error: "Invalid email" });
                }
    
                if (!comparePasswords(password, user.password)) {
                    return res.status(400).send({ status: "error", error: "Invalid password" });
                }
            }
    
            const access_token = generateToken(user);
    
            res.cookie('jwtCookieToken', access_token, {
                maxAge: 5 * 60 * 1000,
                httpOnly: true
            }).redirect(`/products?access_token=${access_token}`);
        } catch (e) {
            console.error(e.message);
        }
    };

     userLogout = async (req, res) => {  
        res.clearCookie("jwtCookieToken");
        res.status(200).redirect('/login'); 
     };

};


module.exports = UserController;