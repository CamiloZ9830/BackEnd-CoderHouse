
const userModel = require('../modelsMongo/users.model');


class MongoUsersDao {
    constructor() {
        this.model = userModel
    }

    
     fieldValidator = async (field) => {
         try{
             const fieldExists = await this.model.findOne(field).select(["userName", "email", "password"]);
             return fieldExists;
        }
          catch (e) {
            console.error(e.message);
          }  
     };

     updateUserAttribute = async (userId, attr, newAttrValue) => {
            try {
                const update = await this.model.updateOne(
                    {_id: userId},
                    {$set: { [attr]: newAttrValue } }
                );

                if(update.modifiedCount === 1) {
                    console.log("User attribute updated succesfully");
                    const user = this.model.findById(userId);
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
            const saveUser = await this.model.create(userRegistrationData);
            return saveUser;   
        }
        catch (e) {
            console.error(e.message);
        }
     };

     getUser = async (email) => {
           try{
            const getUser = await this.model.findOne({"email" : email});          
            return getUser;
           }
           catch(e) {
               console.error(e.message);
           }
     };




};

module.exports = MongoUsersDao;