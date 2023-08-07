
class UserRepository {
    constructor (userDao, cartDao) {
        this.userDao = userDao;
        this.cartDao = cartDao;
    }

        getUser = async (email) => {
            try {
                const user = await this.userDao.getUser(email);
                return user;
            } catch(e) {
                console.error(e.message);
            }
        };

        registerUser = async (userRegistrationData) => {
            try {
                const newCart = {};
                const user = await this.userDao.registerUser(userRegistrationData);
                if(!user) return console.log("error creating user");
                const createCart = await this.cartDao.addCart(newCart);
                if(!createCart) return console.log("error creating cart");

                const registrationData = { 
                                           user: user, 
                                           cartId: createCart 
                                         };

                return registrationData;
                
            } catch(e) {
                console.error(e.message);
            }
        };

        updateUserAttribute = async (userId, attr, newAttrValue) => {
            try {
                const update = await this.userDao.updateUserAttribute(userId, attr, newAttrValue);
                return update;
            } catch(e) {
                console.error(e.message);
            }
        };

        deleteUser = async (attr, email) => {
            try{
                const findUser = await this.userDao.getUser(email);
                const deleteUser = await this.userDao.deleteUser(attr, email);
                if(deleteUser.deletedCount === 1 && findUser?.cartId) {
                    await this.cartDao.deleteCart(findUser.cartId);
                }
                return deleteUser;
            }catch(e){
                console.error(e.message);
            }
        };


        fieldValidator = async (field) => {
            try {
                const fieldExists = await this.userDao.fieldValidator(field);
                return fieldExists;
            } catch (e) {
                console.error(e.message);
              }
        };
        

};


module.exports = UserRepository;