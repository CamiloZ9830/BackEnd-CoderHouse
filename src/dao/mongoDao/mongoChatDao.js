const chatModel = require('../modelsMongo/chat.models');


class MongoChatManager {
    constructor () {
        this.uri = null;
        this.connection = null
        this.model = chatModel
    }
    
     

      saveMessage = async (message) => {
        try{
             const saveMessage = await this.model.create(message);
               return (`message with id: ${saveMessage._id} succesfully saved`);
        }
        catch (e) {
            console.error(e.message);
        }
      };

    };


    module.exports = MongoChatManager;