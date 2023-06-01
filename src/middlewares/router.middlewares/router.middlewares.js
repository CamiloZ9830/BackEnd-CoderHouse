const mongoDBUsersManager = require('../../dao/mongoDB/mongoUsersManager');


const mongoUsersManager = new mongoDBUsersManager();


const userNameValidator = async (req, res, next) => {
    const {userName} = req.body;
    try {
        const field = {"userName" : userName}
        const userNameExists = await mongoUsersManager.fieldValidator(field);

        if(!userNameExists) {
            next();
            return;
        } 
        else {
            res.status(409).send("Your username is already taken");
        }

    }

    catch(e) {
        console.error(e.message);
    }

};

const emailValidator = async (req, res, next) => {
    const { email } = req.body;
    const field = {"email" : email};
    const emailExists = await mongoUsersManager.fieldValidator(field);

    if(!emailExists) {
     next();
     return;
    }
    else {
        res.status(409).send('Your email is already taken');
    }
};


module.exports = {
    emailValidator,
    userNameValidator
}