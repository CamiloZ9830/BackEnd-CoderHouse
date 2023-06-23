
class ProductsRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async (limit, page, category, sort) => {       
          try {
            const getProd = await this.dao.getProducts(limit, page, category, sort); 
            return getProd;

          } catch (e) {
             console.error(e.message);
          }
    };

    addProduct = async (product) => {      
        try{
          const addProd = await this.dao.addProduct(product);
          return addProd;  
        }
        catch (e) {
          return console.error(e.message);
        }
     };

     findProductById = async (product) => {      
      try{
        const findProd = await this.dao.findProductById(product);
        return findProd;  
      }
      catch (e) {
        return console.error(e.message);
      }
   };

   substractStock = async (prodId, quantity) => {
    try{
      const updateStock = await this.dao.substractStock(prodId, quantity);
      return updateStock;  
    }
    catch (e) {
      return console.error(e.message);
    }
   };


    updateProductById = async (id, product) => {      
        try{
          const findProd = await this.dao.updateProductById(id, product);
          return findProd;  
        }
        catch (e) {
          return console.error(e.message);
        }
};


    deleteProduct = async (id) => {
      try{
          const deleteProd = await this.dao.deleteProduct(id);
          return deleteProd;        
      } catch(e) {
        console.error(e.message);
      }
    };


};


module.exports = ProductsRepository;