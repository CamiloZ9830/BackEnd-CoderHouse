const MongoUsersDao = require('../dao/mongoDao/mongoUsersDao');


class UserService {
    constructor() {
        this.usersDao = new MongoUsersDao();
    };


    async fieldValidator (field) {
        try {
            const fieldExists = await this.usersDao.fieldValidator(field);
            return fieldExists;
        } catch (e) {
            console.error(e.message);
          }
    };

    async registerUser(userRegistrationData) {
        try {
          const register = await this.usersDao.registerUser(userRegistrationData);
          return register;
        } catch (e) {
          console.error(e.message);
        }
      };
    
      async userLogIn(email) {
        try {
          const getUser = await this.usersDao.userLogIn(email);
          return getUser;
        } catch (e) {
          console.error(e.message);
        }
      };

      async updateUserAttribute(userId, newAttrValue) {
        try {
          const update = await this.usersDao.updateUserAttribute(userId, newAttrValue);
          return update;
        } catch (e) {
          console.error(e.message);
        }
      };


};

module.exports = UserService;