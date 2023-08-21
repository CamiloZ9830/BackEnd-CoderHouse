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
    documentsStatus: {
        type: String,
        enum: ['complete', 'incomplete', 'empty'],
        default: 'empty'
        },
    documents: [{
        name: {
            type: String,
            enum: ['identificacion', 'domicilio', 'cuenta'],
            required: true
        },
        reference: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        inmutable: true,
        type: Date,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    lastConnection: {
        type: Date,
        default: () => Date.now()
    }
    
});

const userModel = mongoose.model(usersCollection, userSchema);

module.exports = userModel;