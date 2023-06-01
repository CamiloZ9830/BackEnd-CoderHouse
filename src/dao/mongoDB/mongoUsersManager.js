const mongoose = require('mongoose');
const userModel = require('../models/users.model');


class mongoDBUsersManager {
    constructor() {
        this.uri = 'mongodb+srv://juanzora:JnzR43GjwHnIfd42@cluster1store.qiis50v.mongodb.net/?retryWrites=true&w=majority';
        this.connection = mongoose.connect(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.user = userModel
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
            const register = await userModel.create(userRegistrationData);
            return register;
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

module.exports = mongoDBUsersManager;