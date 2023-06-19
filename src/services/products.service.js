const MongoProductDao = require('../dao/mongoDao/mongoProductDao');


class ProductService {
    constructor() {
        this.productsDao = new MongoProductDao()
    }
     
   async getProducts (limit, page, category, sort) {
        try {
            const getProd = await this.productsDao.getProducts(limit, page, category, sort);
            return getProd;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addProduct (product) {
        try {
            const addProd = await this.productsDao.addProduct(product);
            return addProd;
          } catch (e) {
            console.error(e.message);
          }
    };

    async findProductById (id) {
         try {
            const findProd = await this.productsDao.findProductById(id);
            return findProd;
         } catch (e) {
          console.error(e.message);
         }
    };
  
    async updateProductById (id, product) {
      try {
         const findProd = await this.productsDao.findProductById(id, product);
         return findProd;
      } catch (e) {
       console.error(e.message);
      }  
    };
    
    async deleteProduct (id) {
      try {
         const findProd = await this.productsDao.findProductById(id);
         return findProd;
      } catch (e) {
       console.error(e.message);
      }
};

};

module.exports = ProductService;

