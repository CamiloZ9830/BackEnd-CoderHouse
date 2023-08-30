
const userModel = require('../modelsMongo/users.model');


class MongoUsersDao {
    constructor() {
        this.model = userModel
    }

    
     fieldValidator = async (field) => {
         try{
             const fieldExists = await this.model.findOne(field).select(["userName", "email", "password", "role", "documentsStatus"]);
             return fieldExists;
        }
          catch (e) {
            console.error(e.message);
          }  
     };

     //pendiente borrar
     getUserById = async (id) => {
        try{
            const getUser = await this.model.findById(id);
            return getUser;
       }
         catch (e) {
           console.error(e.message);
         }  
    };

     getAllUsersPagination = async (limit, page, role, sort) => {
        try{
            const getAllUsers = await this.model.paginate( role, { limit: limit, sort: sort, page: page } );
            return getAllUsers;
        }catch(e){
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

     getUser = async (attr, value) => {
           try{
            const getUser = await this.model.findOne({[attr] : value});          
            return getUser;
           }
           catch(e) {
               console.error(e.message);
           }
     };

     lastConnection = async (userId) => {
        try{
            const updateLastConnection = await this.model.updateOne(
                { _id: userId },
                { $set: { lastConnection: Date.now() } }
            );
            return updateLastConnection;
        }catch(e){
            console.error(e.message);
        }
     };

     deleteUser = async (attr, value) => {
        try{
            const deleteUser = await this.model.deleteOne(
                {[attr]: value},         
            )
            return deleteUser;
        }catch(e){
            console.error(e.message);
        }
     };    

     updateDocStatus = async (userId, document, ref) => {
        try{ 
            const updateDocStatus = await this.model.updateOne(
                { _id: userId,
                    'documents.name': document
                 },
                { 
                    $set: { 'documents.$.reference': ref }
                }                      
            );
            if (updateDocStatus?.modifiedCount === 0) {
                await this.model.updateOne(
                    { _id: userId },
                    { 
                        $addToSet: { 
                            documents: { 
                                name: document, 
                                reference: ref 
                            } 
                        }
                    }
                );
            }
            const updatedUser = await this.model.findById(userId);
            if (updatedUser?.documents.length > 0 && updatedUser?.documents.length < 3) {        
                await this.model.updateOne(
                    { _id: userId },
                    {                     
                        $set: { 'documentsStatus': 'incomplete' } 
                    }
                );
            }
            if (updatedUser?.documents.length === 3) {        
                await this.model.updateOne(
                    { _id: userId },
                    {                     
                        $set: { 'documentsStatus': 'complete' } 
                    }
                );
            }
                      
            return updatedUser;
              
        }catch(e){
            console.error(e.message);
        }
     };
};

module.exports = MongoUsersDao;