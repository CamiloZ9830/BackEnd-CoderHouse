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
   
     
     registerUser = async (userRegistrationData) => {
        try{
            const register = await userModel.create(userRegistrationData);
            return register;
        }
        catch (e) {
            console.error(e.message);
        }
     };

     userLogIn = async (userName) => {
           try{
            const getUser = await userModel.findOne({"userName" : userName});          
            return getUser;
           }
           catch(e) {
               console.error(e.message);
           }
     };




};

module.exports = mongoDBUsersManager;