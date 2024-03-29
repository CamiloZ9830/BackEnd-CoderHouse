const mongoose = require('mongoose');
const cartsModel = require('../modelsMongo/carts.model');



class MongoCartsDao {
    constructor () {
        this.model = cartsModel
    }

      getCartById = async (id) => {
      try{
        const getCart = await this.model.findById(id)
        return getCart;
    }
    catch (e) {
        console.error(e.message);
    }  
    };

       
      getCartByIdPopulate = async (id) => {
        try{         
            const getCart = await this.model.findById(id)
            .populate('products.product', ['title', 'description', 'price', 'thumbnail', 'code', 'category']).lean();
            return getCart;
        }
        catch (e) {
            console.error(e.message);
          }
        };
        

     
       addCart = async (newCart) => {
              try{
                 const createCart =  await this.model.create(newCart);
                 return createCart._id;
              }

              catch (e) {
                  console.error(e.message);
              }
       };


      /* addProductId = async (cartId, prodId) => {
           let newProd = {
            product: prodId,
            quantity: 1
           };
                try{
                  await this.connect();
                  const getCart = await this.getCartById(cartId);
                    const { products } = getCart;
                    const index = products.findIndex(prod => prod.product == prodId);

                   if (index > -1) {
                    products[index].quantity += 1;                   
                   }
                     else {
                        products.push(newProd);
                     }
                          const saveNewProd = await getCart.save();
                          return saveNewProd;
                  }
                  catch (e) {
                    console.error(e.message);
                  }
       }; */

       /*agrega el producto o si ya existe suma +1 a la quantity*/
       addProductId = async (cartId, prodId) => {
        try {
          const result = await this.model.updateOne(
            { _id: cartId, 'products.product': prodId },
            { $inc: { 'products.$.quantity': 1 } }
          );
               console.log(result);
          if (result.modifiedCount === 0) {
            await this.model.updateOne(
              { _id: cartId },
              { $addToSet: { products: { product: prodId, quantity: 1 } } }
            );
          }
          return result;
        } catch (e) {
          console.log(e.message);         
        }
      };

      /*addProductId = async (cartId, prodId) => {
        try {
          const result = await this.cart.updateOne(
            { _id: cartId, 'products.product': prodId },
            { $inc: { 'products.$.quantity': 1 } },
            {upsert: true}
          );
               console.log(result);
               if (result.upsertedCount === 1) {
                return 'Product added to cart';
              } else if (result.modifiedCount === 1) {
                return 'Product quantity updated';
              }
          return 'Product added to cart';
        } catch (e) {
          console.log(e.message);         
        }
      };*/



        /* addProductQuantity = async (cartId, prodId, qty) => {
              try {
                  await this.connect();
                    const getCart = await this.getCartById(cartId);
                    const { products } = getCart;
                    const index = products.findIndex(prod => prod.product == prodId);

                    if (index > -1 && qty > 0 && qty < 11) {
                         products[index].quantity = qty;
                         const savedProduct = await getCart.save();
                         return savedProduct;
                    }
                    return 'Quantity value either too high or too low to update';
              } 

              catch (e) {
                   console.error(e.message);
              }
         };*/

         /*modifica el carrito con un nuevo arreglo de productos*/
         addNewArrayOfProducts = async (cartId, arrayProd) => {
           try {
                 await this.model.findByIdAndUpdate(
                { _id: cartId },
                { $set: { "products": arrayProd } }             
              )
              return "Updated";
           }
           catch (e) {
            console.error(e.message);
           }

         };

         removeProductsFromCart = async (cartId, arrayProdId) => {
          try {
                await this.model.updateMany(
               { _id: cartId },
               { $pull: { products: { product: { $in: arrayProdId } } } }           
             )
             return "Updated";
          }
          catch (e) {
           console.error(e.message);
          }

        };


       /*modifica la quantity del producto pasado por el req.body*/
       addProductQuantity = async (cartId, prodId, qty) => {
          try {
            const updatedCart = await this.model.findOneAndUpdate(
              {
                _id: cartId,
                "products.product": prodId,
                "products.quantity": { $gte: 1, $lte: 10 }
              },
              { $set: { "products.$.quantity": qty } },
              { new: true }
            );       
            if (!updatedCart) {
              return "Quantity value either too high or too low to update";
            }   
            return updatedCart;
          } catch (e) {
            console.error(e.message);
          }
        };


       /*deleteProductId = async (cartId, prodId) => {

             try{
               await this.connect();
               const getCart = await this.getCartById(cartId);
                 const { products } = getCart;
                 const index = products.findIndex(prod => prod.product == prodId);
                  
                if (index > -1) {
                  if (products[index].quantity === 1) {
                    await this.cart.updateOne({ _id: cartId },
                    { $pull: { products: { product: prodId } } });
                    return `Product ID ${prodId} deleted succesfully`
                  }
                    else {
                         products[index].quantity -= 1;  
                         const saveNewProd = await getCart.save();
                           return saveNewProd;                 
                    }
                }
                else {
                  return `Product ID ${prodId} not found`;
                }
                       
               }
               catch (e) {
                 console.error(e.message);
               }
    };*/

        /*elimina un producto del carrito y si la cantidad el mas de uno resta -1 al quantity*/
    deleteProductId = async (cartId, prodId) => {
      try {
       await this.model.updateOne(
          { _id: cartId, 'products.product': prodId },
          { $inc: { 'products.$.quantity': -1 } }
        );
        
        const deleteProduct = await this.model.updateOne(
          { _id: cartId },
          { $pull: { products: { product: prodId, quantity: 0 } } }
        );
    
        if (deleteProduct.modifiedCount === 1) return `Product ID ${prodId} deleted succesfully`;
        else return `product quantity has been updated`;
      } 
      catch (e) {
        console.log(e.message);
      }
    };

    deleteProductIdFromCart = async (cartId, prodId) => {
      try{
          const deleteProductId = await this.model.updateOne(
            { _id: cartId },
            { $pull: { products: { product: prodId }}}
          );
          if (deleteProductId.modifiedCount === 1) return `Product ID ${prodId} deleted succesfully`;
            else return `product quantity has been updated`;
            
      }catch(e){
         console.log(e.message);
      }
    };

    /*deleteAllProducts = async (cartId) => {
           try {
                await this.connect();
                const getCart = await this.getCartById(cartId);
                const { products, _id } = getCart;
                if(products.length > 0) {
                  
                    products.splice(0, products.length);
                      await getCart.save();
                      return `cart with id: ${_id} cleared succesfully`;
                }
                else {
                    return 'Cart is already empty';
                }
           }
             catch (e) {
                 console.error(e.message);
             }
    };*/
     /*elimina todos los productos del carrito*/
    deleteAllProducts = async (cartId) => {
      try {
        const deleteAll = await this.model.updateOne(
          { _id: cartId },
          { $set: { products: [] } }
        );
         if (deleteAll.modifiedCount === 1) return `cart with id: ${cartId} cleared succesfully`;
         else return `Cart is already empty`;
         }


          catch (e) {
                 console.error(e.message);
            }
    };

    deleteCart = async (cartId) => {
      try{
        const deleteCart = await this.model.deleteOne(
          {_id: cartId}
        );
        return deleteCart.deletedCount;
      }catch(e){
        console.error(e.message);
      }
    }


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



module.exports = MongoCartsDao;