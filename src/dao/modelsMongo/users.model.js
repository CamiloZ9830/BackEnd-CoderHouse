const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        immutable: true,
        default: ''
    },
    lastName: {
        type: String,
        immutable: true,
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
        immutable: true,
        unique: true,
        default: ''
    },
    dateOfBirth: {
        type: String,
        immutable: true,
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
        immutable: true,
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

userSchema.index({ lastConnection: 1 }, { expireAfterSeconds: 30 * 60 }); 
userSchema.plugin(mongoosePaginate);
const userModel = mongoose.model(usersCollection, userSchema);

module.exports = userModel;