const MongoUsersDao = require('../dao/mongoDao/mongoUsersDao');
const UserRepository = require('../repositories/user.respository');
const { hashPassword, comparePasswords } = require('../utils/session.utils');
const MongoCartsDao = require('../dao/mongoDao/mongoCartsDao');


class UserService {
    constructor() {
        this.repository = new UserRepository(new MongoUsersDao(), new MongoCartsDao());    
    }


    async fieldValidator (field) {
        try {
            const fieldExists = await this.repository.fieldValidator(field);
            return fieldExists;
        } catch (e) {
            console.error(e.message);
          }
    };

    async registerUser(userRegistrationData) {
      const { password } = userRegistrationData; 
     if (password) {
      userRegistrationData["password"] = hashPassword(password);
     }
        try {
          const register = await this.repository.registerUser(userRegistrationData);
          if(register) {
            try{ 
              console.log("register: ", register);
                  const saveUserWithCartId = await this.updateUserAttribute(register.user._id, register.cartId);
                     if(!saveUserWithCartId) return console.log("could not assign a cartId to the new user");
                     return saveUserWithCartId;                  
            }
            catch(e) {
                console.error(e.message);
            }

        } else {
            console.log({status: "error", message: "Error saving user"});
        }
        } catch (e) {
          console.error(e.message);
        }
      };
    
      async userLogIn(userCredentials) {
        const { email, password } = userCredentials;
        try {
          const getUser = await this.repository.getUser(email);
          if (!getUser) {
             throw new Error('Invalid email');
          }
          if (!comparePasswords(password, getUser.password)) {
            throw new Error('Invalid password');
            } else {
              getUser["password"] = null;
            }
          return getUser;
        } catch (e) {
          console.error(e.message);
          throw e;
        }
      };

      async updateUserAttribute(userId, newAttrValue) {
        try {
          const update = await this.repository.updateUserAttribute(userId, newAttrValue);
          return update;
        } catch (e) {
          console.error(e.message);
        }
      };


};

module.exports = UserService;