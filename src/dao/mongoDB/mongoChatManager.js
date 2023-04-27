const mongoose = require('mongoose');
const chatModel = require('../models/chat.models');


class mongoDbChatsManager {
    constructor () {
        this.uri = 'mongodb+srv://juanzora:JnzR43GjwHnIfd42@cluster1store.qiis50v.mongodb.net/?retryWrites=true&w=majority';
        this.connection = null
        this.chat = null
    }
    
     connect = async () => {
        try {
          this.connection = mongoose.connect(this.uri, {
             useNewUrlParser: true,
             useUnifiedTopology: true
          }); 
           console.log('Connected to MongoDB Atlas', mongoose.connection.readyState);
           this.carts = chatModel;
         }
        catch (e) {
          console.error(e.message);
            process.exit();
           }
      };


      saveMessage = async (message) => {
        try{
             await this.connect();
             const saveMessage = await chatModel.create(message);
               return (`message with id: ${saveMessage._id} succesfully saved`);
        }
        catch (e) {
            console.error(e.message);
        }
      };

    };


    module.exports = mongoDbChatsManager;