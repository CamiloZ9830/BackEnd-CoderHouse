const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'products'
        },

        quantity: {
            type: Number,
            min: 1,
            max: 10
        }}
    ],
    createdAt: {
        immutable: true,
        type: Date,
        default: () => Date.now()
    }  
});


const cartsModel = mongoose.model(cartsCollection, cartsSchema);


module.exports = cartsModel; 