const MongoUsersDao = require('../dao/mongoDao/mongoUsersDao');
const UserRepository = require('../repositories/user.respository');
const { hashPassword, comparePasswords, randomDate } = require('../utils/session.utils');
const MongoCartsDao = require('../dao/mongoDao/mongoCartsDao');
const { faker } = require('@faker-js/faker');


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

    async switchUserRole (userId, userRole) {
      try {
        if (userRole === "user") {
          const userRole = await this.updateUserAttribute(userId, "role", "premium"); 
          userRole["password"] = null;
          return userRole;
        }else if(userRole === 'premium'){
          const userRole = await this.updateUserAttribute(userId, "role", "user");
          return userRole;
        }
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
                  const saveUserWithCartId = await this.updateUserAttribute(register.user._id, "cartId", register.cartId);
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
              await this.lastConnection(getUser._id);
              getUser["password"] = null;
            }
          return getUser;
        } catch (e) {
          console.error(e.message);
          throw new Error(e.message);
        }
      };

      async lastConnection(userId) {
        try {
          const update = await this.repository.lastConnection(userId);
          return update;
        } catch (e) {
          console.error(e.message);
        }
      };

      async updateUserAttribute(userId, attr, newAttrValue) {
        try {
          const update = await this.repository.updateUserAttribute(userId, attr, newAttrValue);
          return update;
        } catch (e) {
          console.error(e.message);
        }
      };

      async deleteUser (attr, email) {
        try{
          const deleteUser = await this.repository.deleteUser(attr, email);
          return deleteUser;
        }catch(e){
          throw new Error(e.message);
        }
      };

      async updateDocument (userId, document, ref) {
        try{
          const updateUserStatus = await this.repository.updateStatus(userId, document, ref);
          return updateUserStatus;
        }catch(e){
          throw new Error(e.message);
        }
      }

      /*fake user generator /@faker-js */
      async fakeUser() {
        const userRoleEnum = {
           user: "user",
           premium: "premium"
        }
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            userName: faker.internet.userName(),
            email: faker.internet.email(),
            dateOfBirth: randomDate(new Date(1950, 0, 1), new Date(2010, 0, 1)),
            password: faker.internet.password({length: 16}),
            role: faker.helpers.enumValue(userRoleEnum),
        }
      };


};

module.exports = UserService;