const mongoose = require('mongoose');

const ticketCollection = 'order';

const ticketSchema = new mongoose.Schema({
      code: {
         type: String,
         immutable: true,
         unique: true,
         required: true
      },
      buyerEmail: {
         type: String,
         immutable: true,
      },
      orderBy: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: 'user',
         immutable: true,
         required: true
      },
      orderProducts: [{
        productId: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: 'products',
         required: true
         },
         quantity: {
            type: Number,
         }
       }],
      orderStatus: {
         type: String,
         default: 'Pending'
      },
      amount: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
     },
     updatedAt: {
        type: Date,
        default: () => Date.now()
     }

});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = ticketModel;