
class CartRepository {
        constructor(cartDao, productsDao, ticketDao) {
          this.cartDao = cartDao;
          this.productDao = productsDao;
          this.ticketDao = ticketDao;
        }

        getCartById = async (id) => {
            try {
                const getCart = await this.cartDao.getCartById(id);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };

        getProductOrderData = async (prodId) => {
           try{
                const getProd = this.productDao.findProductById(prodId);
                if(!getProd) return console.log("error getting product");

               return getProd;

           } catch(e) {
              throw new Error(e.message)
           }
        };

        substractProductStock = async (prodId, quantity) => {
          try{
               const updateStock = this.productDao.substractProduct(prodId, quantity);
               if(!updateStock) return console.log("error updating product stock");

              return updateStock;

          } catch(e) {
             throw new Error(e.message)
          }
       };

       substractManyProductStock = async (productsObj) => {
        console.log("from repository cart:" , productsObj);
        try{
             const updateStock = this.productDao.substractMany(productsObj);
             if(!updateStock) return console.log("error updating products stock");

            return updateStock;

        } catch(e) {
           throw new Error(e.message)
        }
     };

     removeProductsFromCart = async (cartId, arrayProdId) => {
      try{
           const updateStock = this.cartDao.removeProductsFromCart(cartId, arrayProdId);
           if(!updateStock) return console.log("error updating cart");

          return updateStock;

      } catch(e) {
         throw new Error(e.message)
      }
   };

   saveTicketPurchase = async (newTicket) => {
    try {
      const saveTicket = await this.ticketDao.saveTicketPurchase(newTicket);
      return saveTicket;
    } catch (e) {
      throw new Error(e.message)
    }
   };

     

        getCartByIdPopulate = async (id) => {
            try {
                const getCart = await this.cartDao.getCartByIdPopulate(id);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };
        
        addCart = async (newCart) => {
            try {
                const getCart = await this.cartDao.addCart(newCart);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };

        

        addProductId = async (cartId, prodId) => {
            try {
                const getCart = await this.cartDao.addProductId(cartId, prodId);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };

        addNewArrayOfProducts = async (cartId, arrayProd) => {
            try {
                const getCart = await this.cartDao.addNewArrayOfProducts(cartId, arrayProd);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };

        addProductQuantity = async (cartId, prodId, qty) => {
            try {
                const getCart = await this.cartDao.addProductQuantity(cartId, prodId, qty);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };

        deleteProductId = async (cartId, prodId) => {
            try {
                const getCart = await this.cartDao.deleteProductId(cartId, prodId);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };

        deleteAllProducts = async (cartId) => {
            try {
                const getCart = await this.cartDao.deleteAllProducts(cartId);
                return getCart;
              } catch (e) {
                throw new Error(e.message)
              }
        };     

};

module.exports = CartRepository;