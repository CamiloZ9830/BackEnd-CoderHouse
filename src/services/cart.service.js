const MongoCartsDao = require('../dao/mongoDao/mongoCartsDao');
const MongoProductsDao = require('../dao/mongoDao/mongoProductDao');
const MongoTicketDao = require('../dao/mongoDao/mongoTicketDao');
const CartRepository = require('../repositories/cart.repository');
const mongoose = require('mongoose');
const { randomUUID } = require('crypto');


class CartService {
       constructor(){
        this.repository = new CartRepository(new MongoCartsDao(), new MongoProductsDao(), new MongoTicketDao());
       }

       async getCartById (id) {
        try {
            const getCart = await this.repository.getCartById(id);
            return getCart;
          } catch (e) {
            console.error(e.message);
          }
    };

    async getCartByIdPopulate (id) {
        try {
            const getCart = await this.repository.getCartByIdPopulate(id);
            return getCart;
          } catch (e) {
            console.error(e.message);
          }
    };

    async cartPurchase (cartId, user) {
      try {
        const getCart = await this.getCartById(cartId);
        const orderProducts = [];
        const quantitiesToSubstract = {};
        const productsToRemove = [];
        let amount = 0;

        const arrayOfProductsId = getCart.products.map( item => item.product);
        const batchProducts = await this.repository.getCartProductsOrder("_id", arrayOfProductsId);
    
        for (const item of getCart.products) {

            const getProd = batchProducts.find(product => product._id.toString() === item.product); 
           
            if (getProd?.stock >= item.quantity) {
                  quantitiesToSubstract[getProd._id] = item.quantity;
                  productsToRemove.push(getProd._id);
                  orderProducts.push({productId: getProd._id,
                                      quantity: item.quantity});
                  amount = amount += getProd.price * item.quantity;                   

            }
          };
         
        const updateCart = await this.repository.removeProductsFromCart(cartId, productsToRemove);
        if (!updateCart) return console.log(`error updating cartId: ${cartId}`);
        const updateStock = await this.repository.substractManyProductStock(quantitiesToSubstract);
        if(!updateStock) return console.log("error updating quantities");
        if(amount === 0) return console.log({error: "Purchase failed, no stock for the current products",
                                              items: getCart.products});

        const purchaseOrder = {
                      code: randomUUID(),
                      orderBy: user._id,
                      buyerEmail: user.email,
                      orderProducts: orderProducts,
                      amount: amount,
        };

        //console.log("purchaseOrder: ", purchaseOrder);
        
        await this.repository.saveTicketPurchase(purchaseOrder);

        return purchaseOrder;
      } catch (e) {
        console.error(e.message);
      }
    };

    async addCart () {
        try {
           const newCart = {};
            const addCart = await this.repository.addCart(newCart);
            return addCart;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addProductId (cartId, prodId) {
        try {
            const addProductId = await this.repository.addProductId(cartId, prodId);
            return addProductId;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addNewArrayOfProducts (cartId, arrayProd) {
        try {
            const addProducts = await this.repository.addNewArrayOfProducts(cartId, arrayProd);
            return addProducts;
          } catch (e) {
            console.error(e.message);
          }
    };

    async addProductQuantity (cartId, prodId, qty) {
        try {
            const addQuantity = await this.repository.addProductQuantity(cartId, prodId, qty);
            return addQuantity;
          } catch (e) {
            console.error(e.message);
          }
    };

    async deleteProductId (cartId, prodId) {
        try {
            const deleteProd = await this.repository.deleteProductId(cartId, prodId);
            return deleteProd;
          } catch (e) {
            console.error(e.message);
          }
    };

    async deleteFromCart (cartId, prodId) {
      try {
        const deleteProd = await this.repository.deleteFromCart(cartId, prodId);
        return deleteProd;
      } catch (e) {
        console.error(e.message);
      }
    }

    async deleteAllProducts (cartId) {
        try {
            const deleteAll = await this.repository.deleteAllProducts(cartId);
            return deleteAll;
          } catch (e) {
            console.error(e.message);
          }
    };

};


module.exports = CartService;