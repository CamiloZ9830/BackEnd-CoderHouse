
class UserRepository {
    constructor (userDao, cartDao) {
        this.userDao = userDao;
        this.cartDao = cartDao;
    }

        getUser = async (attr, value) => {
            try {
                const user = await this.userDao.getUser(attr, value);
                return user;
            } catch(e) {
                console.error(e.message);
            }
        };

        getUsersPagination = async (limit, page, role, sort) => {
            try{
                const getUsers = await this.userDao.getAllUsersPagination(limit, page, role, sort);
                return getUsers;
            }catch(e){
                console.error(e.message);
            }
        }

        getUserById = async (id) => {
            try {
                const user = await this.userDao.getUserById(id);
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

        deleteUser = async (attr, value) => {
            try{
                const findUser = await this.userDao.getUser(attr, value);
                const deleteUser = await this.userDao.deleteUser(attr, value);
                if(deleteUser.deletedCount === 1 && findUser?.cartId) {
                    await this.cartDao.deleteCart(findUser.cartId);
                }
                return deleteUser;
            }catch(e){
                console.error(e.message);
            }
        };

        updateStatus = async (userId, document, ref) => {
             try{
                const updateSatus = await this.userDao.updateDocStatus(userId, document, ref);
                return updateSatus; 
            }catch(e){
                console.error(e.message);
            }
        };

        lastConnection = async (userId) => {
            try{
                const updateLastConnection = await this.userDao.lastConnection(userId);
                return updateLastConnection;
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