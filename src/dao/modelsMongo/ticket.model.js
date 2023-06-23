const mongoose = require('mongoose');

const ticketCollection = 'order';

const ticketSchema = new mongoose.Schema({
      code: {
         type: String,
         inmutable: true,
         unique: true,
         require: true
      },
      buyerEmail: {
         type: String,
         inmutable: true,
      },
      orderBy: {
         type: mongoose.SchemaTypes.ObjectId,
         ref: 'user',
         inmutable: true,
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
        inmutable: true,
        default: () => Date.now()
     },
     updatedAt: {
        type: Date,
        default: () => Date.now()
     }

});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = ticketModel;