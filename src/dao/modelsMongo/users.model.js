const mongoose = require('mongoose');

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        inmutable: true,
        default: ''
    },
    lastName: {
        type: String,
        inmutable: true,
        default: ''
        },
    userName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        inmutable: true,
        unique: true,
        default: ''
    },
    dateOfBirth: {
        type: String,
        inmutable: true,
        default: ''
    },
    password: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: "user"
    },
    cartId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'carts',
        default: null
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