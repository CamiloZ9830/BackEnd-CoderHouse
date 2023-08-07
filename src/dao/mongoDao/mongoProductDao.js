const productsModel = require('../modelsMongo/products.model')

class MongoProductsDao {
    constructor () {
      this.model = productsModel
    }

          /*pagination*/
          /* organiza los productos de la base de datos paginados usando "mongoose Paginate V2" con filtros como categoria, sort, y limit */
         getProducts = async (limit, page, category, sort) => {
               try {       
                  
                  const getProd = await this.model.paginate( category, {limit: limit, sort: sort, page: page});
                  
                  return getProd                          
               }
            
               catch (e) {
                console.error(e.message);
               }
         };

         
          addProduct = async (product) => {     
               try {
                     const savedProduct =  await this.model.create(product);
                       console.log('Success: ', savedProduct);
                        return savedProduct._id;                   
                  }  
                    catch (e) {
                      console.error(e.message);
                    }
         };

         findMany = async (attribute, arrayOfProducts) => {
          try{
            const findMany = await this.model.find({ [attribute]: { $in: arrayOfProducts } });
            return findMany;
          }catch(e){
            console.error(e.message);
          }
         }


         findProductById = async (id) => {
              try {
                const findProd = await this.model.findById(id);
                if(!findProd) {
                  return ({status:"error", message: `Object with id: ${id} not found`})
                }
                return findProd;
              }
              catch (e) {
                  console.error(e.message);
              }
         };

         substractStock = async (prodId, quantity) => {
              try{
                  const updateStock = await this.model.findByIdAndUpdate(
                    prodId,
                    { $inc: { stock: -quantity } }
                  );
                  return updateStock;
              } catch (e) {
                  throw new Error(e.message)
              }
         };

         substractMany = async (productsObj) => {
            const productIds = Object.keys(productsObj);
          try{
            for(const id of productIds) {
              const quantity = productsObj[id];
                 await this.model.updateOne(
                 { _id: id },
                 { $inc: {stock: -1 * quantity} }
              );
            };
            return { status: "success", message: "Stock Updated" };
        } catch (e) {
            throw new Error(e.message)
        }
        };



         updateProductById = async (id, product) => {
            
          try{
            const findProd = await this.findProductById(id);
            if (!findProd) {
                return findProd;
            }
             findProd.updatedAt = Date.now();
             const updatedProduct = Object.assign(findProd, product);
             const saveUpdatedProduct = await updatedProduct.save();
             console.log(saveUpdatedProduct._id);
             return saveUpdatedProduct;   
          }
          catch (e) {
            return console.error(e.message);
          }
          };


         deleteProduct = async (id) => {      
                 try {
                     const deleteProd = await this.model.deleteOne({ _id : id});
                     if (deleteProd.deletedCount !== 1) return {status: "success", message: `Product with ID ${id} not found`};
                      return {status: "success", message: `Product with ID ${id} deleted succesfully`};
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


module.exports = MongoProductsDao;