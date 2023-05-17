const mongoose = require('mongoose');

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        inmutable: true,
    },
    lastName: {
        type: String,
        required: true,
        inmutable: true
    },
    userName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        inmutable: true,
        validate: {
            validator: value => { return  /\S+@\S+\.\S+/.test(value) },
         message: 'Please enter a valid email'
      }
    },
    dateOfBirth: {
        type: String,
        inmutable: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "User"
    },
    timestamp: {
        inmutable: true,
        type: Date,
        default: () => Date.now()
    }
    
});


const userModel = mongoose.model(usersCollection, userSchema);

module.exports = userModel;