const MongoCartsDao = require('../dao/mongoDao/mongoCartsDao');

class CartService {
       constructor(){
        this.cartDao = new MongoCartsDao()
       }

       async getCartById (id) {
        try {
            const getCart = await this.cartDao.getCartById(id);
            return getCart;
          } catch (e) {
            console.error(e.message);
          }
    };

    async getCartByIdPopulate (id) {
        try {
            const getCart = await this.cartDao.getCartByIdPopulate(id);
            return getCart;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addCart () {
        try {
            const addCart = await this.cartDao.addCart(id);
            return addCart;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addProductId (cartId, prodId) {
        try {
            const addProductId = await this.cartDao.addProductId(cartId, prodId);
            return addProductId;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addNewArrayOfProducts (cartId, arrayProd) {
        try {
            const addProducts = await this.cartDao.addNewArrayOfProducts(cartId, arrayProd);
            return addProducts;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addProductQuantity (cartId, prodId, qty) {
        try {
            const addQuantity = await this.cartDao.addProductQuantity(cartId, prodId, qty);
            return addQuantity;
          } catch (e) {
            console.error(e.message);
          }
    };

    async deleteProductId (cartId, prodId) {
        try {
            const deleteProd = await this.cartDao.deleteProductId(cartId, prodId);
            return deleteProd;
          } catch (e) {
            console.error(e.message);
          }
    };

    async deleteAllProducts (cartId) {
        try {
            const deleteAll = await this.cartDao.deleteAllProducts(cartId);
            return deleteAll;
          } catch (e) {
            console.error(e.message);
          }
    };

};


module.exports = CartService;