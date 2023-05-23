const mongoose = require('mongoose');

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        inmutable: true,
        default: ''
    },
    lastName: {
        type: String,
        required: true,
        inmutable: true,
        default: ''
        },
    userName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
        inmutable: true,
        default: ''
    },
    dateOfBirth: {
        type: String,
        inmutable: true,
        default: ''
    },
    password: {
        type: String,
        required: true,
        default: ''
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        inmutable: true,
        type: Date,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
    
});


const userModel = mongoose.model(usersCollection, userSchema);

module.exports = userModel;