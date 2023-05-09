const mongoose = require('mongoose');
const productsModel = require('../models/products.model')

class mongoDBProductsManager {
    constructor () {
      this.uri = 'mongodb+srv://juanzora:JnzR43GjwHnIfd42@cluster1store.qiis50v.mongodb.net/?retryWrites=true&w=majority'
      this.connection = mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
     }); 
      this.carts = productsModel
    }

          /*pagination*/
          /* organiza los productos de la base de datos paginados usando "mongoose Paginate V2" con filtros como categoria, sort, y limit */
         getProducts = async (limit, page, category, sort) => {

          if (typeof category === "string") {
            category = {category: { $regex: new RegExp(category, "i") }};
          }
          
          if (Object.keys(sort).length !== 0) {
            sort = {price: sort};           
            }

               try {       
                  const getProd = await productsModel.paginate( category, {limit: limit, sort: sort, page: page});
                  return getProd                          
               }
            
               catch (e) {
                console.error(e.message);
               }
         };

         
          addProduct = async (product) => {     
               try {
                     const savedProduct =  await productsModel.create(product);
                       console.log('Success: ', savedProduct);
                        return savedProduct._id;                   
                  }  
                    catch (e) {
                      console.error(e.message);
                    }
         };


         findProductById = async (id) => {
              try {
                const findProd = await productsModel.findById(id);
                if(!findProd) {
                  return ({failed: `Object with id: ${id} not found`})
                }
                return findProd;
              }
              catch (e) {
                  console.error(e.message);
              }
         };


         updateProductById = async (id, product) => {
            
                  try{
                    const findProd = await productsModel.findById(id);
                    if (!findProd) {
                        return ({failed: `Object with id: ${id} not found`});
                    }
                     findProd.updatedAt = Date.now();
                     const updatedProduct = Object.assign(findProd, product);
                     const saveUpdatedProduct = await updatedProduct.save();
                     return saveUpdatedProduct;   
                  }
                  catch (e) {
                    return console.error(e.message);
                  }
         };


         deleteProduct = async (id) => {
          
                 try {
                     const deleteProd = await productsModel.deleteOne({ _id : id});
                     if (deleteProd.deletedCount !== 1) return `product with ID ${id} not found`;
                      return `Product with ID ${id} deleted succesfully`;
                 }
                 catch (e) {
                  return e.message;
                 }
         };



            disconnect = async () => {
                try {
                      await mongoose.disconnect();
                      console.log('Disconnected from MongoDB Atlas');
                }
                catch (e) {
                    console.error(e.message);
                }
            };


};


module.exports = mongoDBProductsManager;