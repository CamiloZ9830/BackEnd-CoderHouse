
const userModel = require('../modelsMongo/users.model');
const mongoCartsDao = require('../mongoDao/mongoCartsDao');


class MongoUsersDao {
    constructor() {
        this.user = userModel
        this.cart = new mongoCartsDao()
    }

    
     fieldValidator = async (field) => {
         try{
             console.log(field);
             const fieldExists = await userModel.findOne(field).select(["userName", "email"]);
             return fieldExists;
        }
          catch (e) {
            console.error(e.message);
          }  
     };

     updateUserAttribute = async (userId, newAttrValue) => {
            try {
                const update = await userModel.updateOne(
                    {_id: userId},
                    {$set: {"cartId": newAttrValue } }
                );

                if(update.modifiedCount === 1) {
                    console.log("User attribute updated succesfully");
                    const user = userModel.findById(userId);
                    return user;
                }
                else {
                    console.log('User not found or attribute value unchanged');
                  }
            }

            catch(e) {
                console.error(e.message);
            }
     };
   
     
     registerUser = async (userRegistrationData) => {
        try{
            let saveUser = await userModel.create(userRegistrationData);
            if(saveUser) {
                try{
                    const createCart = await this.cart.addCart();
                     if(!createCart) return console.log("error creating cart");
                      saveUser["cartId"] = createCart;
                      const saveUserWithCartId = await this.updateUserAttribute(saveUser._id, createCart._id);
                         if(!saveUserWithCartId) return console.log("could not assign a cartId to the new user");
                         return saveUserWithCartId;                  
                }
                catch(e) {
                    console.error(e.message);
                }

            }

            else {
                console.log({status: "error", message: "Error saving user"});
            }
        }
        catch (e) {
            console.error(e.message);
        }
     };

     userLogIn = async (email) => {
           try{
            const getUser = await userModel.findOne({"email" : email});          
            return getUser;
           }
           catch(e) {
               console.error(e.message);
           }
     };




};

module.exports = MongoUsersDao;