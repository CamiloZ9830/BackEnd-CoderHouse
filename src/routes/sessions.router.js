const { Router } = require('express');
const router = Router();
const mongoDbUsersManager = require('../dao/mongoDB/mongoUsersManager');
const mongoUserManager = new mongoDbUsersManager;


const userNameValidator = async (req, res, next) => {
    
        const {userName} = req.body;
        const field = {"userName" : userName}
        const userNameExists = await mongoUserManager.fieldValidator(field);
        console.log("validator: ", userNameExists);
        
        if(!userNameExists) {
            next();
            return;
        }
        else {
            res.status(404).send('Your username is already taken');
        }
};


const emailValidator = async (req, res, next) => {
       const { email } = req.body;
       const field = {"email" : email};
       const emailExists = await mongoUserManager.fieldValidator(field);
       console.log("validator: ", emailExists);

       if(!emailExists) {
        next();
        return;
       }
       else {
           res.status(404).send('Your email is already taken');
       }
};

const logInValidator = async (req, res, next) => {
    const { userName, password } = req.body;
    const userLogIn = await mongoUserManager.userLogIn(userName, password);
    if (userLogIn) {
        if(userName === userLogIn.userName && password === userLogIn.password) {
            next();
            return;  
        }
    }
    else if(userName === "adminCoder@coder.com" && password === "admin123"){
        req.session.role = "Admin";
        next();
        return;
    }
    else {
        res.status(404).send('Invalid Credentials');
    }
    
};


router.post('/registration', userNameValidator, emailValidator, async (req, res) => {
       try {
           const {firstName, lastName, userName, dateOfBirth, email, password} = req.body;
           
           const newUser = {
                firstName,
                lastName,
                userName,
                dateOfBirth,
                email,
                password
            };

           const addNewUser = await mongoUserManager.registerUser(newUser);
           res.cookie('aCookie', "Esta es una cookie", {maxAge: 10000}).status(201).send({status: "success", payload: {message: "New user has been registered succesfully",
                                                              username: addNewUser.userName,
                                                              email: addNewUser.email
                                                             }
                                                            });      
       }
       catch (e) {
          res.status(500).json({message: e.message});
       }
});

router.post('/login', logInValidator, async (req, res) => {
    try{
         req.session.userName = req.body.userName;
         console.log("the name is :", req.session.userName);
         res.cookie('aCookie', "Esta es una Cookie", {maxAge: 10000});
         res.redirect('/products');
    }

    catch (e) {
        res.status(500).json({message: e.message});
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login'); 
    });
});


router.get('/api/session', async (req, res) => {
/*if (req.session.counter){
        req.session.counter ++;
        res.send(`Se ha visitado el sitio ${res.session.counter} veces`)
    }
    else {
        req.session.counter = 1;
        res.send(`Bienvenido! ${req.session.counter}`)
    }*/
     res.cookie('aCookie', "Esta es una cookie", {maxAge: 10000}).send("cookie seteada");
});

module.exports = router;