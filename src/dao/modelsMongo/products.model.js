const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productsCollection = 'products';


const productsSchema = new mongoose.Schema({
     title: {
        type: String,
        required: true,
        unique: true
      },
     description: String,
     price: {
      type: Number,
      min: 0
     },
     thumbnail: {
       type: [String],
       default: ["https://trek.scene7.com/is/image/TrekBicycleProducts/BontragerSolsticeMIPSCPSC_30466_A_Primary?$responsive-pjpg$&cache=on,on&wid=800&hei=600"]
     },
     status: {
        type: Boolean,
        default: true
     },
     code: {
      type: String,
      required: true,
      unique: true
     },
     stock: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
     },
     category: String,
     owner: {
      type: String,
      default: 'admin'
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

/*mongoose middleware*/
productsSchema.pre('save', async function (next) {
   try {
      const findProd = await productsModel.findById(id);
      if(findProd.code && findProd.title) {
         const err = new Error('Product already exists');
         return next(err);
      }
       next();     
   }
   catch (e) {
      console.error(e.message);
   }
});

productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);
 

module.exports = productsModel;