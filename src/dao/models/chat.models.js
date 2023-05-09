const mongoose = require('mongoose');

const chatsCollection = 'messages';


const chatSchema = new mongoose.Schema({
      
      user: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: value => { return  /\S+@\S+\.\S+/.test(value) },
         message: 'Please enter a valid email'
      }},

      message: {
          type: String,
          required: true,
          validate: {
            validator: value =>  {
              return /^[\w\s.,¡!¿?áéíóúüñÁÉÍÓÚÜÑ-]{1,500}$/.test(value);
            },
            message: props => `${props.value} is not a valid message!`
          }
        },

      timestamps: {
            inmutable: true,
            type: Date,
            default: () => Date.now()
        }
      
});


const chatModel = mongoose.model(chatsCollection, chatSchema);


module.exports = chatModel;