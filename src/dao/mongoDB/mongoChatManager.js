const mongoose = require('mongoose');
const chatModel = require('../models/chat.models');


class mongoDbChatsManager {
    constructor () {
        this.uri = null;
        this.connection = null
        this.chat = null
    }
    
     

      saveMessage = async (message) => {
        try{
             const saveMessage = await chatModel.create(message);
               return (`message with id: ${saveMessage._id} succesfully saved`);
        }
        catch (e) {
            console.error(e.message);
        }
      };

    };


    module.exports = mongoDbChatsManager;