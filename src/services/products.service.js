const MongoProductDao = require('../dao/mongoDao/mongoProductDao');
const ProductsRepository = require('../repositories/products.repository');
const { faker } = require('@faker-js/faker');


class ProductService {
    constructor() {
        this.repository = new ProductsRepository(new MongoProductDao())
    }
     
   async getProducts (limit, page, category, sort) {

    if (typeof category === "string") return category = {category: { $regex: new RegExp(category, "i") }};

          if (Object.keys(sort).length !== 0) return sort = {price: sort};  
        try {
            const getProd = await this.repository.getProducts(limit, page, category, sort);

            const { hasNextPage, hasPrevPage, nextPage, prevPage } = getProd;
               const products1 = "http://localhost:8080/api/products";
         
               /*objeto agrega "nextLink" y "prevLink"  */
               /*para la vista de productos se usa la direccion /products que esta en views.router */
               hasNextPage ? getProd["nextLink"] = `${products1}?page=${nextPage}`
               : getProd["nextLink"] = null;
               hasPrevPage ? getProd["prevLink"] = `${products1}?page=${prevPage}` 
               : getProd["prevLink"] = null;

            return getProd;
            
          } catch (e) {
            console.error(e.message);
          }
    };

    async addProduct (product) {
        try {
            const addProd = await this.repository.addProduct(product);
            return addProd;
          } catch (e) {
            console.error(e.message);
          }
    };

    /* product mock creado con faker usado en la ruta product.controller*/
    async createRandomProduct () {
            return {
                 title: faker.vehicle.model(),
                 description: faker.commerce.productDescription(),
                 price: faker.number.int({min: 100, max: 10000}),
                 thumbnail: faker.image.url(),
                 stock: faker.number.int({max: 99}),
                 code: faker.string.uuid(),
                 category: faker.commerce.department()
            }
    };

    async findProductById (id) {
         try {
            const findProd = await this.repository.findProductById(id);
            return findProd;
         } catch (e) {
          console.error(e.message);
         }
    };

    async substractStock (prodId, quantity) {
      try {
        const findProd = await this.repository.substractStock(prodId, quantity);
        return findProd;
     } catch (e) {
        console.error(e.message);
     }
    }
  
    async updateProductById (id, product) {
      try {
         const findProd = await this.repository.updateProductById(id, product);
         return findProd;
      } catch (e) {
       console.error(e.message);
      }  
    };
    
    async deleteProduct (id) {
      try {
         const findProd = await this.repository.deleteProduct(id);
         return findProd;
      } catch (e) {
       console.error(e.message);
      }
};

};

module.exports = ProductService;

